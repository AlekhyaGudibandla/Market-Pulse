import hashlib
import json
import logging
from typing import Dict, Optional, Any
from datetime import datetime, timedelta

logger = logging.getLogger("marketpulse.idempotency")


class IdempotencyRecord:
    def __init__(self, key: str, status: str = "COMMITTED", payload_hash: str = ""):
        self.key = key
        self.status = status  # PROCESSING, COMMITTED, FAILED
        self.payload_hash = payload_hash
        self.created_at = datetime.utcnow()
        self.last_attempt_at = datetime.utcnow()
        self.retries = 0


class IdempotencyManager:
    """
    Ensures exactly-once processing semantics for events arriving via Kafka or connectors.
    Maintains a hash fingerprint of event source, URL, title, and normalized content.
    """
    def __init__(self, ttl_hours: int = 72):
        self.ttl_delta = timedelta(hours=ttl_hours)
        self._store: Dict[str, IdempotencyRecord] = {}

    @staticmethod
    def compute_fingerprint(source: str, source_url: str, title: str, content: str) -> str:
        """
        Creates a deterministic SHA-256 fingerprint ignoring minor whitespace discrepancies.
        """
        normalized_content = " ".join(content.strip().lower().split()[:250])
        normalized_title = " ".join(title.strip().lower().split())
        canonical_str = f"{source}|{source_url.strip().lower()}|{normalized_title}|{normalized_content}"
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    def check_and_reserve(self, event_id: str, payload_hash: str) -> bool:
        """
        Atomically checks if an event has already been committed or is actively being processed.
        Returns True if processing can proceed, False if it's a duplicate.
        """
        self._evict_expired()
        
        record = self._store.get(event_id)
        if record:
            if record.status == "COMMITTED":
                logger.info(f"Idempotency filter: event {event_id} already COMMITTED. Suppressing duplicate.")
                return False
            elif record.status == "PROCESSING":
                # If stuck in processing for over 5 minutes, treat as failed worker and retry
                if datetime.utcnow() - record.last_attempt_at > timedelta(minutes=5):
                    logger.warning(f"Event {event_id} was stuck in PROCESSING. Reclaiming lock for retry.")
                    record.last_attempt_at = datetime.utcnow()
                    record.retries += 1
                    return True
                logger.info(f"Event {event_id} is currently PROCESSING by another worker.")
                return False
            elif record.status == "FAILED":
                if record.retries >= 3:
                    logger.warning(f"Event {event_id} has exceeded max retries (3) in FAILED state.")
                    return False
                record.status = "PROCESSING"
                record.last_attempt_at = datetime.utcnow()
                record.retries += 1
                return True

        # New event
        self._store[event_id] = IdempotencyRecord(key=event_id, status="PROCESSING", payload_hash=payload_hash)
        return True

    def commit(self, event_id: str) -> None:
        """Marks event as successfully committed to Graph and Vector indices."""
        if event_id in self._store:
            self._store[event_id].status = "COMMITTED"
            logger.debug(f"Idempotency state for {event_id} -> COMMITTED")

    def fail(self, event_id: str, reason: str = "") -> None:
        """Marks event as failed, eligible for retry or DLQ."""
        if event_id in self._store:
            self._store[event_id].status = "FAILED"
            logger.warning(f"Idempotency state for {event_id} -> FAILED: {reason}")

    def is_processed(self, event_id: str) -> bool:
        record = self._store.get(event_id)
        return record is not None and record.status == "COMMITTED"

    def _evict_expired(self) -> None:
        now = datetime.utcnow()
        expired_keys = [k for k, v in self._store.items() if now - v.created_at > self.ttl_delta]
        for k in expired_keys:
            del self._store[k]


# Global singleton
idempotency_manager = IdempotencyManager()
