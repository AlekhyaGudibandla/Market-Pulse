# MarketPulse: Architectural Specification & System Design

MarketPulse is a continuous competitive intelligence platform. Unlike conversational question-answering bots or static news dashboards, MarketPulse models the market as a continuously updated **Temporal Knowledge Graph**, evaluates the systemic disruption of each new event, and synthesizes traceable evidence explaining **what changed, why it matters, and what evidence supports the conclusion**.

---

## 1. High-Level System Architecture

```
[ External Data Sources ]
  Tech News (RSS) · Company Blogs · Patent Databases (USPTO/EPO) · Product Changelogs
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ Ingestion & Connector Layer                             │
│ - Rate-limited asynchronous pollers                    │
│ - Canonical URL normalization & metadata extraction    │
│ - SHA-256 Content Fingerprinting                       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Kafka Event Streaming Backbone (KRaft Mode)             │
│ Topics:                                                │
│  - events.raw        (Partitioned by entity/domain)    │
│  - events.parsed     (Structured normalized events)    │
│  - graph.mutations   (Idempotent graph edge delta)     │
│  - alerts.generated  (Actionable intelligence stream)  │
│  - events.dlq        (Isolated poison pill messages)   │
└──────────┬─────────────────────────────┬───────────────┘
           │                             │
           ▼                             ▼
┌──────────────────────┐       ┌────────────────────────┐
│ Entity Resolution    │       │ Temporal Knowledge     │
│ & Extraction         │       │ Graph Engine           │
│ - Alias Disambig.    │       │ - Neo4j 5 + NetworkX   │
│ - Confidence Filter  │       │ - Bi-temporal Edges    │
│ - Candidate Queue    │       │ - Multi-hop Traversal  │
└──────────┬───────────┘       └───────────┬────────────┘
           │                               │
           └───────────────┬───────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Novelty & Impact Change-Detection Engine                │
│ - Deduplication & Syndication Suppression              │
│ - Graph Topology Delta Calculation                     │
│ - Degree & PageRank Centrality Multiplier              │
│ - Ripple Traversal (Affected Competitors 1-2 Hops)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Advanced 8-Strategy RAG & Synthesis Engine             │
│  1. Hybrid RAG (BM25 + Dense Vector RRF)               │
│  2. GraphRAG (Multi-hop Indirect Relationship Search)  │
│  3. Temporal RAG (Historical State Reconstruction at T)│
│  4. Event-Centric RAG (Chronological Milestone Chains) │
│  5. Multi-Hop Hypothesis Pathfinder                    │
│  6. Contradiction-Aware Retrieval                      │
│  7. Query-Adaptive Intent Classifier & Router          │
│  8. Evidence-Grounded Synthesis (Citations & Dossiers) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Presentation & Delivery Interface                     │
│ - Next.js 14 + React 18 + TypeScript Web UI            │
│ - Server-Sent Events (SSE) Live Feed Streamer          │
│ - Interactive Force-Directed Knowledge Graph Visualizer│
│ - Change-Impact Simulator                              │
│ - Spring Boot Enterprise Core (Actuator, Auditing)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Engineering Pillars

### A. Temporal Knowledge Graph
Relationships possess validity intervals (`valid_since`, `valid_until`), confidence scores, and evidence pointers. When a partnership ends or an executive moves, history is preserved non-destructively by assigning `valid_until = timestamp` rather than deleting edges.

### B. Reliable Event Processing
- **Idempotency**: Every event is fingerprinted with SHA-256 canonical hashing across `(source, source_url, title, normalized_content)`. Duplicate deliveries are suppressed.
- **Dead-Letter Queue (DLQ)**: Poison messages failing after 3 exponential backoff attempts are isolated to `events.dlq`.
- **State Reconciliation**: A background reconciliation worker audits counts between Kafka offsets, Knowledge Graph nodes/edges, and Vector index entries.

### C. Entity Resolution & Canonical Registry
Prevents landscape fragmentation by disambiguating raw mentions ("NVDA", "Nvidia Corp", "NVIDIA") to canonical entity records (`company_nvidia`). Ambiguous mentions below threshold ($0.78$) are preserved in the `unresolved_candidate_queue` without corrupting the graph.

### D. Novelty & Impact Scoring
Distinguishes between repetitive syndicated press articles and genuine market shifts:
$$\text{Novelty} = 0.65 \cdot \Delta_{\text{graph}} + 0.35 \cdot \Delta_{\text{semantic}}$$
$$\text{Impact} = 0.40 \cdot W_{\text{type}} + 0.35 \cdot C_{\text{entity}} + 0.25 \cdot N_{\text{competitors}}$$

### E. Advanced 8-Strategy RAG Engine
Routes dynamic queries to the optimal retrieval mechanism, generating traceable answers with interactive citations `[1]`, `[2]` linked to primary source evidence.
