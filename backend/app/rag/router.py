import re
import logging
from typing import Tuple
from datetime import datetime
from app.models.query import RetrievalStrategy

logger = logging.getLogger("marketpulse.rag.router")


class QueryAdaptiveRouter:
    """
    Query-Adaptive Retrieval Router:
    Dynamically classifies query intent and dispatches to the optimal RAG strategy:
    - TEMPORAL: Time-travel queries reconstructing state as of timestamp T
    - GRAPHRAG: Relational and indirect partner/competitor landscape exploration
    - MULTI_HOP: Hypothesis investigation traversing entity chains
    - CONTRADICTION_AWARE: Conflicting claims or veracity checks
    - EVENT_CENTRIC: Historical milestone sequences and evolutionary timelines
    - HYBRID: Dense semantic + BM25 keyword fusion
    """
    def route_query(self, query: str, as_of_time: datetime = None) -> Tuple[RetrievalStrategy, str]:
        q = query.lower()

        # 1. Explicit or detected temporal inquiry
        if as_of_time or any(w in q for w in ["in 2023", "in 2022", "prior to", "before", "as of", "historical state", "back in"]):
            return (
                RetrievalStrategy.TEMPORAL,
                "Query includes explicit temporal anchor; routed to Temporal RAG to reconstruct past landscape state."
            )

        # 2. Contradiction or disputed claim inquiry
        if any(w in q for w in ["conflict", "dispute", "contradict", "true or false", "exclusively", "discrepancy", "claim vs"]):
            return (
                RetrievalStrategy.CONTRADICTION_AWARE,
                "Query questions veracity or exclusivity; routed to Contradiction-Aware RAG to evaluate source divergences."
            )

        # 3. Multi-hop hypothesis testing
        if any(w in q for w in ["path between", "indirect", "chain", "how is", "connected to", "vulnerable to", "rely on"]):
            if "and" in q or "to" in q:
                return (
                    RetrievalStrategy.MULTI_HOP,
                    "Query investigates multi-hop dependency hypothesis; routed to Multi-Hop Graph Pathfinder."
                )

        # 4. Relational or ecosystem topology
        if any(w in q for w in ["relationship", "partners", "ecosystem", "competitors of", "who supplies", "who makes", "fab"]):
            return (
                RetrievalStrategy.GRAPHRAG,
                "Query targets relational landscape connections; routed to GraphRAG."
            )

        # 5. Evolutionary timeline / event clustering
        if any(w in q for w in ["timeline", "history", "evolution", "chronology", "sequence of events", "progress"]):
            return (
                RetrievalStrategy.EVENT_CENTRIC,
                "Query requests historical trajectory; routed to Event-Centric RAG."
            )

        # 6. Default to Hybrid RAG (BM25 + Semantic dense vector fusion)
        return (
            RetrievalStrategy.HYBRID,
            "General competitive inquiry; routed to Hybrid RAG combining dense vector search and BM25 token matching."
        )


query_router = QueryAdaptiveRouter()
