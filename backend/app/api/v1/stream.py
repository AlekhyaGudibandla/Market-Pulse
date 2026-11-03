import asyncio
import json
import logging
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.streaming.kafka_producer import event_bus
from app.config import settings

logger = logging.getLogger("marketpulse.api.stream")
router = APIRouter()


@router.get("/events", summary="Server-Sent Events (SSE) live stream for incoming alerts and events")
async def sse_event_stream():
    """
    Continuous SSE stream delivering real-time competitive alerts and landscape mutations.
    """
    async def event_generator():
        queue = asyncio.Queue()

        def on_alert(envelope):
            queue.put_nowait(envelope.payload)

        # Register temporary listener
        event_bus.subscribe(settings.KAFKA_ALERTS_TOPIC, on_alert)

        try:
            # Yield initial keep-alive
            yield f"event: connected\ndata: {json.dumps({'message': 'Connected to MarketPulse Intelligence Stream'})}\n\n"

            while True:
                try:
                    payload = await asyncio.wait_for(queue.get(), timeout=20.0)
                    yield f"event: alert\ndata: {json.dumps(payload)}\n\n"
                except asyncio.TimeoutError:
                    # Heartbeat
                    yield f"event: ping\ndata: {json.dumps({'timestamp': asyncio.get_event_loop().time()})}\n\n"
        except asyncio.CancelledError:
            logger.info("SSE client disconnected.")

    return StreamingResponse(event_generator(), media_type="text/event-stream")
