from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.models.query import RAGRequest, GroundedSynthesisReport
from app.rag.synthesizer import synthesizer
from app.pipeline.extraction.extractor import extractor
from app.pipeline.change_detection.novelty_scorer import novelty_scorer
from app.pipeline.change_detection.impact_analyzer import impact_analyzer
from app.models.event import RawEvent, EventSource
from datetime import datetime
import uuid

router = APIRouter()


class ChangeImpactSimulationRequest(BaseModel):
    title: str = Field(..., description="Hypothetical or draft announcement title")
    content: str = Field(..., description="Detailed description of the event or deal")
    source: str = "Analyst Draft"


@router.post("/query", response_model=GroundedSynthesisReport, summary="Multi-strategy evidence-grounded intelligence query")
async def execute_intelligence_query(req: RAGRequest):
    return synthesizer.synthesizer(req) if hasattr(synthesizer, "synthesizer") else synthesizer.synthesize(req)


@router.post("/change-impact", summary="Simulate change-impact analysis for a hypothetical event")
async def simulate_change_impact(req: ChangeImpactSimulationRequest):
    # Construct transient raw event without committing to permanent memory
    dummy_id = f"sim_event_{uuid.uuid4().hex[:8]}"
    raw = RawEvent(
        id=dummy_id,
        title=req.title,
        content=req.content,
        source=EventSource.SIMULATED_FEED,
        source_url="https://marketpulse.ai/simulator",
        content_hash=f"hash_{dummy_id}",
        timestamp=datetime.utcnow()
    )

    norm_event = extractor.extract_from_raw_event(raw)
    novelty = novelty_scorer.evaluate_novelty(norm_event)
    impact, affected_competitors, primary_entity_id = impact_analyzer.analyze_impact(norm_event)

    return {
        "event_title": req.title,
        "extracted_entities": norm_event.extracted_entities,
        "detected_relationships": norm_event.relationships_detected,
        "novelty": novelty,
        "impact": impact,
        "primary_entity_id": primary_entity_id,
        "affected_competitors": affected_competitors,
        "summary": (
            f"If executed, this event would introduce a '{impact.market_disruption_potential}' shift. "
            f"It directly threatens {len(affected_competitors)} competitors and shifts ecosystem centrality."
        )
    }
