import re
import logging
from typing import List, Dict, Tuple, Optional, Any
from difflib import SequenceMatcher
from app.models.entity import Entity, EntityType, EntityResolutionMatch
from app.pipeline.resolution.canonical_registry import CANONICAL_ENTITIES
from app.config import settings

logger = logging.getLogger("marketpulse.resolver")


class EntityResolutionEngine:
    """
    Robust Entity Resolution & Disambiguation Engine:
    1. Exact alias matching (O(1))
    2. Normalized case-insensitive prefix and acronym matching
    3. Multi-token Jaccard / Levenshtein string metric calculation
    4. Segregation into candidate queue if confidence is below threshold
    """
    def __init__(self, confidence_threshold: float = 0.78):
        self.confidence_threshold = confidence_threshold
        self._canonical_entities: Dict[str, Entity] = dict(CANONICAL_ENTITIES)
        self._alias_index: Dict[str, str] = {}
        self._unresolved_queue: List[Dict[str, Any]] = []
        self._build_alias_index()

    def _build_alias_index(self):
        self._alias_index.clear()
        for entity_id, entity in self._canonical_entities.items():
            # Index canonical name
            self._alias_index[entity.name.strip().lower()] = entity_id
            # Index all aliases
            for alias in entity.aliases:
                self._alias_index[alias.strip().lower()] = entity_id

    def add_custom_entity(self, entity: Entity):
        self._canonical_entities[entity.id] = entity
        self._build_alias_index()

    def get_all_canonical_entities(self) -> List[Entity]:
        return list(self._canonical_entities.values())

    def get_entity_by_id(self, entity_id: str) -> Optional[Entity]:
        return self._canonical_entities.get(entity_id)

    @staticmethod
    def _normalize(text: str) -> str:
        return re.sub(r"[^\w\s-]", "", text).strip().lower()

    @staticmethod
    def _similarity_ratio(a: str, b: str) -> float:
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    def resolve_mention(self, raw_mention: str) -> EntityResolutionMatch:
        """
        Disambiguates a mention against known canonical entities.
        """
        clean_mention = self._normalize(raw_mention)
        if not clean_mention:
            return EntityResolutionMatch(raw_mention=raw_mention, confidence=0.0)

        # 1. Exact alias / canonical match
        if clean_mention in self._alias_index:
            entity_id = self._alias_index[clean_mention]
            entity = self._canonical_entities[entity_id]
            return EntityResolutionMatch(
                raw_mention=raw_mention,
                resolved_id=entity.id,
                resolved_name=entity.name,
                entity_type=entity.entity_type,
                confidence=1.0,
                is_disambiguated=True,
                match_strategy="EXACT_ALIAS"
            )

        # 2. Token overlap & fuzzy matching
        candidates: List[Tuple[str, float]] = []
        mention_tokens = set(clean_mention.split())

        for alias_clean, entity_id in self._alias_index.items():
            alias_tokens = set(alias_clean.split())
            
            # Exact token subset match
            if mention_tokens == alias_tokens:
                candidates.append((entity_id, 0.96))
                continue
            
            # Substring match if mention is long enough
            if len(clean_mention) >= 4 and (clean_mention in alias_clean or alias_clean in clean_mention):
                # Score based on length ratio
                len_ratio = min(len(clean_mention), len(alias_clean)) / max(len(clean_mention), len(alias_clean))
                candidates.append((entity_id, max(0.82, len_ratio)))
                continue

            # Levenshtein sequence ratio
            ratio = self._similarity_ratio(clean_mention, alias_clean)
            if ratio >= 0.70:
                candidates.append((entity_id, ratio))

        if not candidates:
            # Route to unresolved queue
            self._unresolved_queue.append({
                "mention": raw_mention,
                "clean": clean_mention,
                "reason": "NO_CANDIDATE_ABOVE_THRESHOLD"
            })
            return EntityResolutionMatch(
                raw_mention=raw_mention,
                confidence=0.0,
                is_disambiguated=False,
                match_strategy="UNRESOLVED_QUEUE"
            )

        # Sort candidates descending by confidence
        candidates.sort(key=lambda x: x[1], reverse=True)
        best_id, best_score = candidates[0]

        if best_score >= self.confidence_threshold:
            entity = self._canonical_entities[best_id]
            return EntityResolutionMatch(
                raw_mention=raw_mention,
                resolved_id=entity.id,
                resolved_name=entity.name,
                entity_type=entity.entity_type,
                confidence=round(best_score, 3),
                is_disambiguated=True,
                match_strategy="FUZZY_RESOLUTION",
                candidate_matches=[{"id": cid, "score": round(sc, 3)} for cid, sc in candidates[:3]]
            )
        else:
            # Below confidence threshold: keep separate
            self._unresolved_queue.append({
                "mention": raw_mention,
                "best_candidate": best_id,
                "score": best_score,
                "reason": "CONFIDENCE_BELOW_THRESHOLD"
            })
            return EntityResolutionMatch(
                raw_mention=raw_mention,
                resolved_id=None,
                confidence=round(best_score, 3),
                is_disambiguated=False,
                match_strategy="UNRESOLVED_QUEUE",
                candidate_matches=[{"id": cid, "score": round(sc, 3)} for cid, sc in candidates[:3]]
            )

    def resolve_multiple(self, mentions: List[str]) -> List[EntityResolutionMatch]:
        results = []
        for m in mentions:
            results.append(self.resolve_mention(m))
        return results

    def get_unresolved_count(self) -> int:
        return len(self._unresolved_queue)


entity_resolver = EntityResolutionEngine(confidence_threshold=settings.ENTITY_RESOLUTION_CONFIDENCE_THRESHOLD)
