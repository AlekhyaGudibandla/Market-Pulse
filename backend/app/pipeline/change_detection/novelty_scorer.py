import logging
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timedelta
from app.models.event import NormalizedEvent
from app.models.alert import NoveltyScore
from app.models.relationship import RelationType
from app.pipeline.graph.graph_service import graph_service

logger = logging.getLogger("marketpulse.novelty")


class NoveltyScoringEngine:
    """
    Evaluates whether an incoming normalized event represents genuine novel intelligence
    or a repetitive syndicated news echo.
    Combines:
    1. Graph topology delta (is this relationship already in our knowledge graph?)
    2. Temporal recency window
    3. Entity co-occurrence novelty
    """
    def __init__(self, novelty_threshold: float = 0.65):
        self.novelty_threshold = novelty_threshold
        # Cache of recently processed events to detect syndication bursts
        self._recent_events_cache: List[Dict[str, Any]] = []

    def evaluate_novelty(self, event: NormalizedEvent) -> NoveltyScore:
        # Check against recent event cache (72-hour window)
        now = datetime.utcnow()
        self._recent_events_cache = [
            e for e in self._recent_events_cache 
            if now - e["timestamp"] < timedelta(hours=72)
        ]

        # 1. Check for syndication repeat (identical title/entity set)
        for past in self._recent_events_cache:
            if set(past["entities"]) == set(event.extracted_entities) and len(past["entities"]) >= 2:
                # High similarity
                title_overlap = len(set(past["title"].lower().split()) & set(event.title.lower().split()))
                if title_overlap >= 4:
                    logger.info(f"Event {event.id} detected as syndicated repeat of {past['id']}")
                    return NoveltyScore(
                        overall_novelty=0.15,
                        semantic_distance=0.10,
                        graph_topology_delta=0.05,
                        is_repeat=True,
                        repeat_of_event_id=past["id"],
                        reasoning=f"Syndicated repetition of previously processed event '{past['title']}' from {past['timestamp'].strftime('%b %d')}."
                    )

        # 2. Check Graph Topology Delta
        existing_rels = graph_service.get_all_relationships(active_only=True)
        graph_delta_score = 0.85
        reasoning_notes = []

        if event.relationships_detected:
            novel_relationships_count = 0
            for rel_candidate in event.relationships_detected:
                src = rel_candidate["source_id"]
                tgt = rel_candidate["target_id"]
                rtype = rel_candidate["relation_type"]

                # Is this relationship already in the graph?
                already_known = False
                for existing in existing_rels:
                    if (existing.source_id == src and existing.target_id == tgt and existing.relation_type.value == rtype) or \
                       (existing.source_id == tgt and existing.target_id == src and existing.relation_type.value == rtype):
                        already_known = True
                        break

                if already_known:
                    reasoning_notes.append(f"Relationship {src} -[{rtype}]-> {tgt} is already active in knowledge graph.")
                else:
                    novel_relationships_count += 1
                    reasoning_notes.append(f"Discovered genuinely NEW relationship {src} -[{rtype}]-> {tgt}.")

            if novel_relationships_count == 0 and len(event.relationships_detected) > 0:
                graph_delta_score = 0.25  # Existing relationship confirmed
            elif novel_relationships_count > 0:
                graph_delta_score = 0.95  # Genuinely new edge added to landscape
        else:
            graph_delta_score = 0.70

        # Semantic distance default
        semantic_distance = 0.80 if graph_delta_score > 0.5 else 0.30
        overall = round((graph_delta_score * 0.65) + (semantic_distance * 0.35), 2)
        is_repeat = overall < self.novelty_threshold

        # Update cache
        self._recent_events_cache.append({
            "id": event.id,
            "title": event.title,
            "entities": event.extracted_entities,
            "timestamp": event.published_at
        })

        return NoveltyScore(
            overall_novelty=overall,
            semantic_distance=semantic_distance,
            graph_topology_delta=graph_delta_score,
            is_repeat=is_repeat,
            repeat_of_event_id=None,
            reasoning="; ".join(reasoning_notes) if reasoning_notes else "New strategic development with unique entity topology."
        )


novelty_scorer = NoveltyScoringEngine()
