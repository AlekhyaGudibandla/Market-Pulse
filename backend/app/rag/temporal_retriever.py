import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.pipeline.graph.graph_service import graph_service
from app.rag.vector_store import vector_store
from app.models.query import EvidenceCitation

logger = logging.getLogger("marketpulse.rag.temporal")


class TemporalRAGRetriever:
    """
    Temporal RAG Strategy:
    Reconstructs the competitive landscape as it existed at a specified historical timestamp T.
    Preserves exact historical state, suppressing later announcements.
    """
    def __init__(self):
        self.graph = graph_service
        self.vector_store = vector_store

    def retrieve(self, query: str, as_of_time: datetime, top_k: int = 6) -> List[EvidenceCitation]:
        # 1. Filter Knowledge Graph relationships valid at as_of_time
        valid_edges = self.graph.query_valid_at(as_of_time)
        citations = []

        for i, edge in enumerate(valid_edges[:top_k]):
            excerpt = (
                f"[State as of {as_of_time.strftime('%Y-%m-%d')}]: "
                f"{edge['source_name']} maintained active relation '{edge['relation_type']}' "
                f"with {edge['target_name']} (established {edge['valid_since'][:10]})."
            )
            citations.append(EvidenceCitation(
                citation_id=f"TEMP-{i+1}",
                source_title=f"Historical State: {edge['source_name']} & {edge['target_name']}",
                source_url="https://marketpulse.ai/timeline/reconstruct",
                published_date=edge['valid_since'][:10],
                excerpt=excerpt,
                reliability_weight=edge.get("confidence", 0.95),
                entity_references=[edge["source_id"], edge["target_id"]]
            ))

        return citations


temporal_retriever = TemporalRAGRetriever()
