from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.alert import IntelligenceAlert, SeverityLevel
from app.pipeline.ingestion.simulated_stream import ALERTS_REPOSITORY

router = APIRouter()


@router.get("", summary="List actionable intelligence alerts")
async def list_alerts(
    severity: Optional[SeverityLevel] = None,
    min_novelty: Optional[float] = Query(None, ge=0.0, le=1.0),
    min_impact: Optional[float] = Query(None, ge=0.0, le=1.0),
    entity_id: Optional[str] = None,
    limit: int = Query(default=30, ge=1, le=100)
):
    filtered = ALERTS_REPOSITORY

    if severity:
        filtered = [a for a in filtered if a.impact.severity == severity]
    if min_novelty is not None:
        filtered = [a for a in filtered if a.novelty.overall_novelty >= min_novelty]
    if min_impact is not None:
        filtered = [a for a in filtered if a.impact.overall_impact >= min_impact]
    if entity_id:
        filtered = [
            a for a in filtered 
            if a.primary_entity_id == entity_id or any(c.competitor_id == entity_id for c in a.affected_competitors)
        ]

    return {
        "count": len(filtered[:limit]),
        "total_available": len(ALERTS_REPOSITORY),
        "alerts": filtered[:limit]
    }


@router.get("/{alert_id}", summary="Get full alert details with evidence chain")
async def get_alert(alert_id: str):
    for a in ALERTS_REPOSITORY:
        if a.id == alert_id:
            return a
    raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")


@router.post("/{alert_id}/acknowledge", summary="Mark an alert as acknowledged")
async def acknowledge_alert(alert_id: str):
    for a in ALERTS_REPOSITORY:
        if a.id == alert_id:
            a.is_acknowledged = True
            return {"status": "ACKNOWLEDGED", "alert_id": alert_id}
    raise HTTPException(status_code=404, detail="Alert not found")
