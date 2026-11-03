import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from app.models.event import RawEvent, EventSource
from app.pipeline.ingestion.simulated_stream import pipeline_service, RAW_EVENTS_REPOSITORY, ALERTS_REPOSITORY
from app.streaming.idempotency import idempotency_manager

router = APIRouter()


class IngestEventRequest(BaseModel):
    title: str
    content: str
    source: EventSource = EventSource.TECH_NEWS
    source_url: str = ""
    author_or_publisher: str = "External Feed"


@router.post("/ingest", summary="Ingest external raw event into streaming pipeline")
async def ingest_event(req: IngestEventRequest):
    event_id = f"evt_{uuid.uuid4().hex[:8]}"
    fingerprint = idempotency_manager.compute_fingerprint(
        source=req.source.value,
        source_url=req.source_url,
        title=req.title,
        content=req.content
    )

    raw = RawEvent(
        id=event_id,
        title=req.title,
        content=req.content,
        source=req.source,
        source_url=req.source_url,
        author_or_publisher=req.author_or_publisher,
        timestamp=datetime.utcnow(),
        content_hash=fingerprint
    )

    alert = await pipeline_service.process_raw_event(raw)
    return {
        "status": "ACCEPTED",
        "event_id": event_id,
        "is_duplicate_suppressed": alert is None,
        "alert": alert
    }


@router.post("/simulate", summary="Trigger a simulated intelligence event cycle")
async def simulate_event(index: Optional[int] = None):
    idx = index if index is not None else len(RAW_EVENTS_REPOSITORY)
    alert = await pipeline_service.run_simulation_cycle(idx)
    return {
        "status": "SIMULATION_EXECUTED",
        "alert": alert
    }


@router.get("", summary="List ingested events")
async def list_events(limit: int = Query(default=20, ge=1, le=100)):
    return {
        "total": len(RAW_EVENTS_REPOSITORY),
        "events": RAW_EVENTS_REPOSITORY[:limit]
    }
