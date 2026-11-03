import logging
from typing import List, Dict, Any
from app.rag.vector_store import vector_store
from app.models.query import EvidenceCitation

logger = logging.getLogger("marketpulse.rag.event")


class EventCentricRetriever:
    """
    Event-Centric RAG Strategy:
    Retrieves and clusters chronological milestone chains rather than isolated textual snippets.
    Surfaces the evolutionary trajectory of competitive battles.
    """
    def __init__(self):
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 5) -> List[EvidenceCitation]:
        # Retrieve candidate event documents
        docs = self.vector_store.search_semantic(query, top_k=top_k * 2)

        # Sort chronologically
        docs_with_dates = []
        for doc, score in docs:
            pub_date = doc.metadata.get("published_at", "2024-01-01")
            docs_with_dates.append((doc, score, pub_date))

        docs_with_dates.sort(key=lambda x: x[2])  # Chronological order

        citations = []
        for i, (doc, score, pub_date) in enumerate(docs_with_dates[:top_k]):
            event_type = doc.metadata.get("event_type", "ANNOUNCEMENT")
            title = doc.metadata.get("title", "Market Milestone")
            excerpt = f"Milestone [{pub_date}] ({event_type}): {title}. {doc.text[:180]}..."

            citations.append(EvidenceCitation(
                citation_id=f"EVT-{i+1}",
                source_title=f"{pub_date} — {title}",
                source_url=doc.metadata.get("url", "https://marketpulse.ai/events"),
                published_date=pub_date,
                excerpt=excerpt,
                reliability_weight=round(score, 2),
                entity_references=doc.metadata.get("entities", [])
            ))

        return citations


event_retriever = EventCentricRetriever()
