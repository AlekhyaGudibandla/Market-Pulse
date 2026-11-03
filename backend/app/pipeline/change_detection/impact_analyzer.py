import logging
from typing import List, Tuple, Dict, Any
from app.models.event import NormalizedEvent, EventType
from app.models.alert import ImpactScore, AffectedCompetitor, SeverityLevel
from app.pipeline.graph.graph_service import graph_service
from app.models.entity import EntityType

logger = logging.getLogger("marketpulse.impact")


class ImpactAnalyzerEngine:
    """
    Analyzes the systemic competitive impact of an event:
    1. Evaluates centralities of involved entities
    2. Identifies directly and indirectly threatened competitors
    3. Calculates systemic market disruption score
    """
    def __init__(self, high_impact_threshold: float = 0.70):
        self.high_impact_threshold = high_impact_threshold

    def analyze_impact(self, event: NormalizedEvent) -> Tuple[ImpactScore, List[AffectedCompetitor], str]:
        if not event.extracted_entities:
            # Low impact generic event
            return (
                ImpactScore(
                    overall_impact=0.30,
                    centrality_shift=0.05,
                    affected_competitors_count=0,
                    severity=SeverityLevel.LOW,
                    market_disruption_potential="Low",
                    rationale="No high-centrality canonical entities detected."
                ),
                [],
                "unknown_entity"
            )

        # Primary entity: company with highest centrality or first company
        primary_entity_id = event.extracted_entities[0]
        max_centrality = 0.0

        for eid in event.extracted_entities:
            cent = graph_service.get_node_centrality(eid)
            ent = graph_service.get_entity(eid)
            if ent and ent.entity_type == EntityType.COMPANY and cent >= max_centrality:
                max_centrality = cent
                primary_entity_id = eid

        primary_ent = graph_service.get_entity(primary_entity_id)
        primary_name = primary_ent.name if primary_ent else primary_entity_id

        # Graph ripple: Find affected competitors
        affected_list: List[AffectedCompetitor] = []
        raw_ripples = graph_service.find_indirectly_affected_competitors(primary_entity_id, max_hops=2)

        for rip in raw_ripples:
            c_id = rip["competitor_id"]
            c_name = rip["competitor_name"]
            hops = rip["hops"]

            if hops == 1:
                threat = SeverityLevel.CRITICAL if max_centrality > 0.4 else SeverityLevel.HIGH
                why = f"Direct rivalry against {primary_name}. Subject to competitive benchmark, pricing, or developer platform pressure."
            else:
                threat = SeverityLevel.MEDIUM
                why = f"Indirect ripple: {rip['path_description']}."

            affected_list.append(AffectedCompetitor(
                competitor_id=c_id,
                competitor_name=c_name,
                threat_level=threat,
                overlap_area=primary_ent.domain_sector if primary_ent else "AI Infrastructure",
                why_affected=why,
                graph_distance=hops
            ))

        # Calculate systemic impact score
        # Base weight on event type
        type_weights = {
            EventType.CHIP_ANNOUNCEMENT: 0.85,
            EventType.PARTNERSHIP: 0.80,
            EventType.ACQUISITION: 0.90,
            EventType.PATENT_PUBLISHED: 0.60,
            EventType.BENCHMARK_CLAIM: 0.75,
            EventType.PRODUCT_RELEASE: 0.70,
            EventType.SUPPLY_CHAIN_SHIFT: 0.85,
            EventType.EXECUTIVE_MOVE: 0.50,
            EventType.REGULATORY_FILING: 0.55
        }
        base_weight = type_weights.get(event.event_type, 0.65)
        centrality_component = min(1.0, max_centrality * 1.5)
        competitor_count_component = min(1.0, len(affected_list) * 0.15)

        overall = round((base_weight * 0.40) + (centrality_component * 0.35) + (competitor_count_component * 0.25), 2)

        if overall >= 0.85:
            severity = SeverityLevel.CRITICAL
            disruption = "Transformative"
        elif overall >= 0.70:
            severity = SeverityLevel.HIGH
            disruption = "High Disruption"
        elif overall >= 0.50:
            severity = SeverityLevel.MEDIUM
            disruption = "Moderate"
        else:
            severity = SeverityLevel.LOW
            disruption = "Localized"

        rationale = (
            f"Event involves {primary_name} (centrality: {round(max_centrality, 2)}). "
            f"Transmits direct competitive pressure to {len(affected_list)} peers across "
            f"{primary_ent.domain_sector if primary_ent else 'AI systems'}."
        )

        impact_score = ImpactScore(
            overall_impact=overall,
            centrality_shift=round(max_centrality * 0.2, 3),
            affected_competitors_count=len(affected_list),
            severity=severity,
            market_disruption_potential=disruption,
            rationale=rationale
        )

        return impact_score, affected_list, primary_entity_id


impact_analyzer = ImpactAnalyzerEngine()
