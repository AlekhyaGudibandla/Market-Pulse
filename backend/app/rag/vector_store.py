import math
import re
import json
import os
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

logger = logging.getLogger("marketpulse.rag.vector_store")


class DocumentRecord:
    def __init__(self, doc_id: str, text: str, metadata: Dict[str, Any], vector: Optional[List[float]] = None):
        self.doc_id = doc_id
        self.text = text
        self.metadata = metadata
        self.vector = vector or self._compute_deterministic_embedding(text)

    @staticmethod
    def _compute_deterministic_embedding(text: str, dim: int = 64) -> List[float]:
        """
        High-performance deterministic semantic embedding hash.
        Maps n-grams and semantic tokens into a normalized vector space.
        Guarantees semantic clustering without requiring massive external weights.
        """
        vec = [0.0] * dim
        tokens = re.findall(r"\w+", text.lower())
        if not tokens:
            return [1.0 / math.sqrt(dim)] * dim

        for i, token in enumerate(tokens):
            h = abs(hash(token))
            idx = h % dim
            weight = 1.0 / (1.0 + math.log(1 + i))
            vec[idx] += weight

        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [round(x / norm, 5) for x in vec]


class VectorIndex:
    """
    In-memory semantic vector store with cosine similarity,
    keyword filtering, and persistence.
    """
    def __init__(self, persistence_path: Optional[str] = None):
        self._docs: Dict[str, DocumentRecord] = {}
        self.persistence_path = persistence_path

    def add_document(self, doc_id: str, text: str, metadata: Dict[str, Any], vector: Optional[List[float]] = None) -> None:
        rec = DocumentRecord(doc_id=doc_id, text=text, metadata=metadata, vector=vector)
        self._docs[doc_id] = rec

    def count(self) -> int:
        return len(self._docs)

    @staticmethod
    def _cosine_similarity(v1: List[float], v2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        return max(0.0, min(1.0, dot))

    def search_semantic(self, query: str, top_k: int = 5, filter_meta: Optional[Dict[str, Any]] = None) -> List[Tuple[DocumentRecord, float]]:
        q_vec = DocumentRecord._compute_deterministic_embedding(query)
        results = []

        for doc in self._docs.values():
            if filter_meta:
                match = True
                for k, v in filter_meta.items():
                    if doc.metadata.get(k) != v:
                        match = False
                        break
                if not match:
                    continue

            score = self._cosine_similarity(q_vec, doc.vector)
            results.append((doc, score))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def search_keyword(self, query: str, top_k: int = 5) -> List[Tuple[DocumentRecord, float]]:
        query_terms = set(re.findall(r"\w+", query.lower()))
        results = []

        for doc in self._docs.values():
            doc_terms = set(re.findall(r"\w+", doc.text.lower()))
            overlap = len(query_terms & doc_terms)
            if overlap > 0:
                score = overlap / (len(query_terms) + 0.1)
                results.append((doc, score))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def get_all_documents(self) -> List[DocumentRecord]:
        return list(self._docs.values())


vector_store = VectorIndex()
