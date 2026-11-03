import logging
import asyncio
from typing import Dict, Any, Callable, List, Optional
from datetime import datetime
from app.streaming.kafka_producer import event_bus, MessageEnvelope, producer
from app.streaming.idempotency import idempotency_manager
from app.config import settings

logger = logging.getLogger("marketpulse.kafka.consumer")


class KafkaConsumerGroup:
    """
    Manages consumer group lifecycle, message dispatch, error handling, retries,
    and DLQ routing for the MarketPulse streaming pipeline.
    """
    def __init__(self, group_id: str):
        self.group_id = group_id
        self._handlers: Dict[str, Callable[[Dict[str, Any]], Any]] = {}
        self.running = False
        self.processed_count = 0
        self.error_count = 0

    def register_handler(self, topic: str, handler: Callable[[Dict[str, Any]], Any]):
        self._handlers[topic] = handler
        # Wire into event bus
        event_bus.subscribe(topic, self._make_topic_dispatcher(topic, handler))
        logger.info(f"Consumer group [{self.group_id}] registered handler for '{topic}'")

    def _make_topic_dispatcher(self, topic: str, handler: Callable[[Dict[str, Any]], Any]):
        async def _dispatcher(envelope: MessageEnvelope):
            payload = envelope.payload
            event_id = payload.get("id") or envelope.key
            content_hash = payload.get("content_hash", "")

            # Stage 1: Idempotency filter
            if not idempotency_manager.check_and_reserve(event_id, content_hash):
                logger.info(f"[{self.group_id}] Idempotency skip: {event_id} on {topic}")
                return

            # Stage 2: Execute processing handler with retries
            max_retries = 3
            attempt = 0
            success = False

            while attempt < max_retries and not success:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(payload)
                    else:
                        handler(payload)
                    
                    idempotency_manager.commit(event_id)
                    self.processed_count += 1
                    success = True
                    logger.debug(f"[{self.group_id}] Successfully processed event {event_id} on {topic}")
                except Exception as e:
                    attempt += 1
                    logger.warning(f"[{self.group_id}] Attempt {attempt}/{max_retries} failed for {event_id}: {str(e)}")
                    if attempt < max_retries:
                        await asyncio.sleep(0.5 * (2 ** (attempt - 1)))  # Exponential backoff
                    else:
                        self.error_count += 1
                        idempotency_manager.fail(event_id, str(e))
                        logger.error(f"[{self.group_id}] Poison message isolated! Moving {event_id} to DLQ.")
                        await producer.send_to_dlq(topic, payload, str(e))

        return _dispatcher

    async def replay_window(self, topic: str, start_time: datetime):
        """
        Replays past events from topic buffer starting at start_time.
        Useful for rebuilding graph/vector indices or recovering from catastrophic failures.
        """
        logger.info(f"Starting replay on topic '{topic}' from {start_time.isoformat()}")
        envelopes = event_bus.replay_from_timestamp(topic, start_time)
        replayed = 0
        handler = self._handlers.get(topic)
        if not handler:
            logger.error(f"No handler registered for topic '{topic}' during replay")
            return 0

        for env in envelopes:
            try:
                # Force reprocess during replay
                if asyncio.iscoroutinefunction(handler):
                    await handler(env.payload)
                else:
                    handler(env.payload)
                replayed += 1
            except Exception as e:
                logger.error(f"Replay error on envelope {env.key}: {e}")

        logger.info(f"Replay complete for topic '{topic}'. {replayed} messages reprocessed.")
        return replayed
