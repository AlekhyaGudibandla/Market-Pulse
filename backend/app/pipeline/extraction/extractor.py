import re
import logging
from typing import List, Dict, Any, Tuple
from datetime import datetime
from app.models.event import RawEvent, NormalizedEvent, EventType, ExtractedClaim
from app.models.relationship import RelationType
from app.pipeline.resolution.resolver import entity_resolver
from app.pipeline.extraction.temporal_parser import temporal_parser

logger = logging.getLogger("marketpulse.extractor")


class InformationExtractionEngine:
    """
    Extracts structured entities, candidate temporal relationships,
    and factual claims from raw event text.
    """
    def __init__(self):
        self.resolver = entity_resolver

        # Relationship trigger patterns
        self.rel_patterns = [
            (RelationType.RELEASED, [
                r"(\b(?:unveiled|announced|released|launched|introduced|revealed)\b)"
            ]),
            (RelationType.PARTNERED_WITH, [
                r"(\b(?:partnered with|partners with|strategic alliance|teams up with|collaboration with)\b)"
            ]),
            (RelationType.SUPPLIES_TO, [
                r"(\b(?:supplies\s+.*to|selected by|manufactured by|contracted\s+.*for|powers)\b)"
            ]),
            (RelationType.COMPETES_WITH, [
                r"(\b(?:competes with|rivals|takes aim at|challenges|counter to|outperforms)\b)"
            ]),
            (RelationType.ACQUIRED, [
                r"(\b(?:acquired|acquires|acquisition of|buys|takeover of)\b)"
            ]),
            (RelationType.FILED_PATENT, [
                r"(\b(?:patent(?:ed)?|patent filing|patent publication|invented)\b)"
            ])
        ]

    def extract_from_raw_event(self, raw: RawEvent) -> NormalizedEvent:
        text = f"{raw.title}. {raw.content}"
        
        # 1. Detect candidate entities across canonical registry
        all_canonical = self.resolver.get_all_canonical_entities()
        found_entity_ids = set()
        
        for entity in all_canonical:
            # Check name
            if re.search(r"\b" + re.escape(entity.name) + r"\b", text, re.IGNORECASE):
                found_entity_ids.add(entity.id)
                continue
            # Check aliases
            for alias in entity.aliases:
                if len(alias) >= 3 and re.search(r"\b" + re.escape(alias) + r"\b", text, re.IGNORECASE):
                    found_entity_ids.add(entity.id)
                    break

        entity_id_list = list(found_entity_ids)

        # 2. Extract relationships between co-occurring entities
        detected_rels = []
        if len(entity_id_list) >= 2:
            detected_rels = self._infer_relationships(text, entity_id_list)

        # 3. Classify event type
        event_type = self._classify_event_type(raw.title, detected_rels)

        # 4. Extract key claims
        claims = self._extract_claims(raw.title, raw.content, entity_id_list)

        return NormalizedEvent(
            id=f"norm_{raw.id}",
            raw_event_id=raw.id,
            event_type=event_type,
            title=raw.title,
            summary=raw.content[:350] + ("..." if len(raw.content) > 350 else ""),
            source=raw.source,
            source_url=raw.source_url,
            published_at=raw.timestamp,
            processed_at=datetime.utcnow(),
            extracted_entities=entity_id_list,
            relationships_detected=detected_rels,
            claims=claims
        )

    def _infer_relationships(self, text: str, entity_ids: List[str]) -> List[Dict[str, Any]]:
        rels = []
        # Check pairs of entities
        for i in range(len(entity_ids)):
            for j in range(i + 1, len(entity_ids)):
                e1 = entity_ids[i]
                e2 = entity_ids[j]
                
                # Check relation patterns in the text
                for rel_type, patterns in self.rel_patterns:
                    for pat in patterns:
                        if re.search(pat, text, re.IGNORECASE):
                            rels.append({
                                "source_id": e1,
                                "target_id": e2,
                                "relation_type": rel_type.value,
                                "confidence": 0.88,
                                "evidence_snippet": text[:150]
                            })
                            break
        return rels

    def _classify_event_type(self, title: str, detected_rels: List[Dict[str, Any]]) -> EventType:
        title_lower = title.lower()
        if any(w in title_lower for w in ["chip", "processor", "gpu", "asic", "accelerator", "semiconductor"]):
            return EventType.CHIP_ANNOUNCEMENT
        if any(w in title_lower for w in ["patent", "uspto", "filing"]):
            return EventType.PATENT_PUBLISHED
        if any(w in title_lower for w in ["partner", "alliance", "deal", "contracts"]):
            return EventType.PARTNERSHIP
        if any(w in title_lower for w in ["acquire", "buys", "purchase", "merger"]):
            return EventType.ACQUISITION
        if any(w in title_lower for w in ["benchmark", "outperforms", "tokens/sec", "latency"]):
            return EventType.BENCHMARK_CLAIM
        if any(w in title_lower for w in ["hire", "appoints", "joins", "departs", "ceo"]):
            return EventType.EXECUTIVE_MOVE
        return EventType.PRODUCT_RELEASE

    def _extract_claims(self, title: str, content: str, entities: List[str]) -> List[ExtractedClaim]:
        sentences = [s.strip() for s in re.split(r"[.!?]", content) if len(s.strip()) > 20]
        claims = []
        for s in sentences[:3]:
            claims.append(ExtractedClaim(
                statement=s,
                confidence=0.92,
                evidence_snippet=s,
                entities_involved=entities[:2]
            ))
        return claims


extractor = InformationExtractionEngine()
