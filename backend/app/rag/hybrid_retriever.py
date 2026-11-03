import logging
from typing import List, Dict, Any, Tuple
from app.rag.vector_store import vector_store, DocumentRecord
from app.models.query import EvidenceCitation

logger = logging.getLogger("marketpulse.rag.hybrid")


class HybridRetriever:
    """
    Hybrid RAG: Combines exact keyword BM25 retrieval with dense semantic vector similarity
    using Reciprocal Rank Fusion (RRF).
    Formula: RRF_score(d) = sum(1.0 / (60 + rank_i(d)))
    """
    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 6) -> List[EvidenceCitation]:
        # 1. Semantic search
        semantic_hits = self.vector_store.search_semantic(query, top_k=top_k * 2)
        # 2. Keyword search
        keyword_hits = self.vector_store.search_keyword(query, top_k=top_k * 2)

        # 3. Reciprocal Rank Fusion
        rrf_scores: Dict[str, float] = {}
        doc_map: Dict[str, DocumentRecord] = {}

        for rank, (doc, _) in enumerate(semantic_hits):
            doc_map[doc.doc_id] = doc
            rrf_scores[doc.doc_id] = rrf_scores.get(doc.doc_id, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        for rank, (doc, _) in enumerate(keyword_hits):
            doc_map[doc.doc_id] = doc
            rrf_scores[doc.doc_id] = rrf_scores.get(doc.doc_id, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # Sort by combined RRF score
        sorted_doc_ids = sorted(rrf_scores.keys(), key=lambda d_id: rrf_scores[d_id], reverse=True)

        citations = []
        for i, d_id in enumerate(sorted_doc_ids[:top_k]):
            doc = doc_map[d_id]
            citations.append(EvidenceCitation(
                citation_id=f"CIT-{i+1}",
                source_title=doc.metadata.get("title", "Corporate Announcement"),
                source_url=doc.metadata.get("url", "https://marketpulse.ai/sources"),
                published_date=doc.metadata.get("published_at", "2024-Q3"),
                excerpt=doc.text[:220] + "...",
                reliability_weight=round(min(1.0, rrf_scores[d_id] * 50), 2),
                entity_references=doc.metadata.get("entities", [])
            ))

        return citations


hybrid_retriever = HybridRetriever()
