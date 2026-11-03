# Advanced 8-Strategy RAG Engine & Routing Logic

MarketPulse provides 8 specialized retrieval strategies tailored for competitive intelligence:

---

## The 8 Retrieval Strategies

| Strategy | Primary Purpose | Underlying Algorithm |
| :--- | :--- | :--- |
| **1. Hybrid RAG** | High-precision textual retrieval combining keyword and semantic meaning | Dense Vector Cosine + BM25 keyword fused via Reciprocal Rank Fusion ($RRF = \frac{1}{60 + \text{rank}}$) |
| **2. GraphRAG** | Discover indirect relationships between companies, products, technologies, and patents | BFS/DFS graph neighborhood expansion up to $K$ hops from target entity anchor nodes |
| **3. Temporal RAG** | Reconstruct the competitive landscape at a specific historical timestamp $T$ | Bi-temporal interval filtering where $\text{valid\_since} \le T \le \text{valid\_until}$ |
| **4. Event-Centric RAG** | Retrieve chronological announcement sequences and strategic evolutions | Chronological clustering across milestone documents |
| **5. Multi-Hop Retrieval** | Follow relationships across multiple entities to investigate a strategic hypothesis | Graph pathfinding between entity pairs via intermediate suppliers, technologies, or partners |
| **6. Contradiction-Aware** | Identify conflicting disclosures, disputed throughput benchmarks, or exclusivity claims | Semantic divergence detection comparing opposing claims across independent sources |
| **7. Query-Adaptive Routing** | Automatically dispatch queries to optimal retrieval strategy | Rule-based and intent classification router analyzing temporal anchors, relational terms, and hypothesis phrasing |
| **8. Evidence-Grounded Synthesis** | Produce structured intelligence reports with interactive citation badges | Grounded Markdown synthesis linking assertions to verifiable primary source excerpts `[1]`, `[2]` |

---

## Routing Decision Tree

```
Query Arrives
  │
  ├─ Contains historical dates / "before" / "as of"? ────────────► TEMPORAL RAG
  │
  ├─ Contains "conflict", "exclusive", "dispute", "claim vs"? ───► CONTRADICTION-AWARE RAG
  │
  ├─ Contains multi-entity hypothesis / "connected to"? ─────────► MULTI-HOP PATHFINDER
  │
  ├─ Inquires about partner ecosystem / suppliers / foundry? ────► GRAPHRAG
  │
  ├─ Inquires about timeline / historical sequence? ─────────────► EVENT-CENTRIC RAG
  │
  └─ Default Technical / Architecture Comparison ───────────────► HYBRID RAG (BM25 + Dense)
```
