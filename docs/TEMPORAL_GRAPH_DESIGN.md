# Temporal Knowledge Graph Design

MarketPulse relies on a **Bi-Temporal Knowledge Graph** to maintain both:
1. **Valid Time**: When the fact or relationship actually occurred in the physical world.
2. **Transaction Time**: When MarketPulse ingested and verified the fact.

---

## 1. Schema & Relationships

### Entity Labels:
- `:Company` (e.g. `company_nvidia`, `company_tsmc`, `company_cerebras`, `company_groq`)
- `:Product` (e.g. `product_b200`, `product_wse3`, `product_groq_lpu`, `product_mi300x`)
- `:Technology` (e.g. `tech_cowos`, `tech_sram_inference`)
- `:Patent` (e.g. `patent_interconnect_2024`)

### Temporal Edge Properties:
Every relationship contains:
- `id`: Unique relationship identifier (e.g., `rel_nvidia_tsmc_cowos`)
- `valid_since`: ISO-8601 timestamp representing when the relationship began
- `valid_until`: Optional ISO-8601 timestamp (null indicates actively ongoing)
- `is_active`: Boolean flag
- `confidence`: Extraction confidence score $[0.0, 1.0]$
- `evidence_chain`: List of primary event IDs, URLs, and text excerpts

---

## 2. Non-Destructive History Preservation

When a competitor terminates a partnership or switches suppliers, standard knowledge graphs overwrite the edge with the new state, erasing historical lineage.

In MarketPulse:
```cypher
// Terminate relationship without deleting history
MATCH (source:Entity {id: $source_id})-[r:TEMPORAL_RELATION {relation_type: $relation_type}]->(target:Entity {id: $target_id})
WHERE r.valid_until IS NULL OR r.is_active = true
SET 
    r.valid_until = datetime($terminated_at),
    r.is_active = false,
    r.termination_evidence_id = $event_id,
    r.updated_at = datetime()
RETURN r
```

---

## 3. Bi-Temporal Time-Travel Query

To reconstruct the exact competitive landscape as it existed on date $T$:
```cypher
MATCH (s:Entity)-[r:TEMPORAL_RELATION]->(t:Entity)
WHERE r.valid_since <= datetime($query_time)
  AND (r.valid_until IS NULL OR r.valid_until >= datetime($query_time))
RETURN s, r, t
```
This enables temporal RAG to answer queries like:
*"What was OpenAI's inference silicon dependency tree before November 2024?"*
