import logging
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.event import NormalizedEvent, EventType
from app.models.alert import IntelligenceAlert, NoveltyScore, ImpactScore, AffectedCompetitor, SeverityLevel
from app.pipeline.graph.graph_service import graph_service
from app.models.relationship import TemporalRelationship, RelationType, EvidenceLink

logger = logging.getLogger("marketpulse.alert_generator")


class AlertGeneratorEngine:
    """
    Synthesizes actionable, evidence-backed competitive intelligence alerts:
    Explains WHAT changed, WHY it matters, HISTORICAL lineage, and TRACEABLE evidence.
    """
    def generate_alert(
        self,
        event: NormalizedEvent,
        novelty: NoveltyScore,
        impact: ImpactScore,
        affected_competitors: List[AffectedCompetitor],
        primary_entity_id: str
    ) -> IntelligenceAlert:
        primary_ent = graph_service.get_entity(primary_entity_id)
        primary_name = primary_ent.name if primary_ent else "Industry Leader"

        # 1. Synthesize WHAT CHANGED
        what_changed = self._synthesize_what_changed(event, primary_name)

        # 2. Synthesize WHY IT MATTERS
        why_it_matters = self._synthesize_why_it_matters(event, primary_name, affected_competitors, impact)

        # 3. Synthesize HISTORICAL CONTEXT
        historical_context = self._synthesize_historical_context(primary_entity_id, event)

        # 4. Compile Traceable Evidence Chain
        evidence_chain = []
        for claim in event.claims:
            evidence_chain.append({
                "statement": claim.statement,
                "confidence": claim.confidence,
                "source_title": event.title,
                "source_url": event.source_url,
                "published_at": event.published_at.strftime("%Y-%m-%d")
            })

        # 5. Extract remaining uncertainties
        uncertainties = self._extract_uncertainties(event)

        # 6. Strategic actions
        actions = self._generate_strategic_actions(event, affected_competitors)

        # Apply graph mutations if novel relationships were extracted
        self._apply_graph_mutations(event)

        alert_id = f"alert_{uuid.uuid4().hex[:10]}"
        return IntelligenceAlert(
            id=alert_id,
            event_id=event.id,
            event_title=event.title,
            timestamp=datetime.utcnow(),
            what_changed=what_changed,
            why_it_matters=why_it_matters,
            historical_context=historical_context,
            novelty=novelty,
            impact=impact,
            primary_entity_id=primary_entity_id,
            primary_entity_name=primary_name,
            affected_competitors=affected_competitors,
            affected_technologies=self._extract_affected_tech(event),
            evidence_chain=evidence_chain,
            remaining_uncertainties=uncertainties,
            recommended_strategic_actions=actions,
            tags=[event.event_type.value, primary_name, impact.severity.value]
        )

    def _synthesize_what_changed(self, event: NormalizedEvent, primary_name: str) -> str:
        if event.event_type == EventType.CHIP_ANNOUNCEMENT:
            return (
                f"{primary_name} officially revealed an advanced architectural development: '{event.title}'. "
                f"This shifts the competitive baseline in generative AI silicon performance and memory bandwidth."
            )
        elif event.event_type == EventType.PARTNERSHIP:
            return (
                f"A new strategic alignment was forged involving {primary_name}. "
                f"The collaboration establishes cross-stack integration that alters previous supply/deployment hierarchies."
            )
        elif event.event_type == EventType.ACQUISITION:
            return (
                f"{primary_name} executed an M&A transaction consolidating specialized IP and engineering talent, "
                f"shutting out rival suitors from acquiring this capability."
            )
        elif event.event_type == EventType.PATENT_PUBLISHED:
            return (
                f"New intellectual property published for {primary_name}: claims reveal technical architecture "
                f"aimed at removing key hardware and software throughput bottlenecks."
            )
        else:
            return f"Significant landscape milestone registered: '{event.title}' under {event.event_type.value}."

    def _synthesize_why_it_matters(
        self,
        event: NormalizedEvent,
        primary_name: str,
        affected_competitors: List[AffectedCompetitor],
        impact: ImpactScore
    ) -> str:
        comp_names = [c.competitor_name for c in affected_competitors[:3]]
        comp_str = ", ".join(comp_names) if comp_names else "competing infrastructure providers"

        return (
            f"This event elevates {primary_name}'s market positioning and exerts direct cost-per-token and "
            f"developer velocity pressure on {comp_str}. "
            f"With disruption potential rated '{impact.market_disruption_potential}', businesses relying on alternative "
            f"architectures must re-evaluate hardware roadmap schedules and multi-cloud lock-in risks."
        )

    def _synthesize_historical_context(self, primary_id: str, event: NormalizedEvent) -> str:
        active_rels = graph_service.get_all_relationships(active_only=True)
        primary_rels = [r for r in active_rels if r.source_id == primary_id or r.target_id == primary_id]
        
        if not primary_rels:
            return f"Initial baseline recording for {primary_id} in MarketPulse competitive graph."

        rel_summaries = []
        for r in primary_rels[:3]:
            partner_id = r.target_id if r.source_id == primary_id else r.source_id
            partner_ent = graph_service.get_entity(partner_id)
            p_name = partner_ent.name if partner_ent else partner_id
            rel_summaries.append(f"established {r.relation_type.value} with {p_name} ({r.valid_since.year})")

        return f"Historically, this entity {'; '.join(rel_summaries)}. The current move builds upon this foundation."

    def _extract_uncertainties(self, event: NormalizedEvent) -> List[str]:
        return [
            "Commercial unit economics and wafer allocation volumes remain unannounced.",
            "Independent third-party reproducibility of quoted inference latency benchmarks.",
            "Firm customer delivery timelines and hyperscaler datacenter deployment dates."
        ]

    def _generate_strategic_actions(self, event: NormalizedEvent, affected: List[AffectedCompetitor]) -> List[str]:
        actions = [
            "Benchmark internal model serving latencies against newly announced performance claims.",
            "Assess multi-vendor fallback options to hedge against exclusive fab or packaging constraints."
        ]
        if affected:
            actions.append(f"Monitor counter-response and promotional pricing from {affected[0].competitor_name}.")
        return actions

    def _extract_affected_tech(self, event: NormalizedEvent) -> List[str]:
        techs = []
        for eid in event.extracted_entities:
            ent = graph_service.get_entity(eid)
            if ent and ent.entity_type.value == "TECHNOLOGY":
                techs.append(ent.name)
        if not techs:
            techs = ["AI Accelerator Silicon", "Wafer Packaging", "Distributed Inference Runtimes"]
        return techs

    def _apply_graph_mutations(self, event: NormalizedEvent):
        """
        Idempotently registers novel relationships into the Knowledge Graph.
        """
        for rel_dict in event.relationships_detected:
            src = rel_dict["source_id"]
            tgt = rel_dict["target_id"]
            rtype_str = rel_dict["relation_type"]
            try:
                rtype = RelationType(rtype_str)
            except ValueError:
                rtype = RelationType.PARTNERED_WITH

            edge_id = f"rel_{src}_{rtype.value.lower()}_{tgt}"
            new_rel = TemporalRelationship(
                id=edge_id,
                source_id=src,
                target_id=tgt,
                relation_type=rtype,
                valid_since=event.published_at,
                valid_until=None,
                is_active=True,
                confidence=rel_dict.get("confidence", 0.9),
                evidence_chain=[
                    EvidenceLink(
                        event_id=event.id,
                        source_url=event.source_url,
                        snippet=rel_dict.get("evidence_snippet", event.title),
                        timestamp=event.published_at
                    )
                ]
            )
            graph_service.add_relationship(new_rel)


alert_generator = AlertGeneratorEngine()
