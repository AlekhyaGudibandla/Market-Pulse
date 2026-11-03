# Entity Resolution & Disambiguation Engine

Entity resolution ensures that varied mentions of companies, products, technologies, and patents are reconciled into canonical graph identities without manual annotation.

---

## Resolution Pipeline

1. **Exact Canonical / Alias Lookup ($O(1)$)**:
   - Direct match against canonical name or known alias dictionary (e.g. "NVDA", "Nvidia Corp" $\to$ `company_nvidia`).
2. **Token Set Jaccard Matching**:
   - Compares token intersections to identify word re-orderings or slight punctuation variations.
3. **Fuzzy String Similarity**:
   - Calculates Levenshtein sequence matcher ratios. Matches scoring $\ge 0.78$ are disambiguated as canonical matches.
4. **Unresolved Candidate Queue**:
   - Mentions falling below confidence threshold ($< 0.78$) are not discarded, nor are they allowed to corrupt the knowledge graph. They are queued into `unresolved_candidate_queue` until corroborating articles provide additional entity context.
