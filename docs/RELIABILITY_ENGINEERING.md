# Reliability Engineering & Streaming Resilience

MarketPulse implements production distributed systems patterns to guarantee message delivery, state consistency, and poison pill isolation.

---

## 1. Idempotency & Deduplication
A single news event may be syndicated across dozens of publications, or Kafka may redeliver a message during consumer rebalancing.

MarketPulse computes a deterministic 256-bit hash:
$$\text{Fingerprint} = \text{SHA-256}(\text{source} \parallel \text{canonical\_url} \parallel \text{normalized\_title} \parallel \text{content\_prefix})$$

The `IdempotencyManager` executes an atomic reservation:
- If state is `COMMITTED`, processing is suppressed immediately.
- If state is `PROCESSING` and exceeds 5 minutes, lock is reclaimed to recover from crashed workers.
- If state is `FAILED`, retried up to 3 times before routing to DLQ.

---

## 2. Dead-Letter Queue (DLQ) & Poison Pill Isolation
Unparseable HTML, corrupt schemas, or unexpected encoding bugs are caught by the consumer dispatcher. Instead of halting partition consumption, messages failing 3 exponential backoff attempts are quarantined into the `events.dlq` topic.

---

## 3. Reconciliation Worker
Runs periodically to audit state synchronization across:
1. Total committed Kafka offsets
2. Neo4j Knowledge Graph nodes & edges
3. Vector Index document records

Any drift or partition lag is flagged in the health check report with automated repair triggers.
