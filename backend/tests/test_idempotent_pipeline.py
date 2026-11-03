import pytest
from app.streaming.idempotency import IdempotencyManager


def test_idempotency_manager_duplicate_suppression():
    mgr = IdempotencyManager()
    event_id = "test_event_dup_101"
    fingerprint = mgr.compute_fingerprint("TECH_NEWS", "https://example.com/a", "Chip Launch", "Company reveals new chip.")

    # 1st reservation: allowed
    can_process = mgr.check_and_reserve(event_id, fingerprint)
    assert can_process is True

    # Commit event
    mgr.commit(event_id)

    # 2nd reservation: blocked
    can_process_dup = mgr.check_and_reserve(event_id, fingerprint)
    assert can_process_dup is False
    assert mgr.is_processed(event_id) is True
