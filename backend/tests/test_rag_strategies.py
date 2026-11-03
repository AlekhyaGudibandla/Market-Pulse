import pytest
from datetime import datetime
from app.models.query import RAGRequest, RetrievalStrategy
from app.rag.synthesizer import synthesizer
from app.rag.router import query_router


def test_query_router_intent_dispatch():
    # Temporal routing
    strategy, _ = query_router.route_query("What was the state of AI chip supply before 2023?")
    assert strategy == RetrievalStrategy.TEMPORAL

    # Contradiction routing
    strategy, _ = query_router.route_query("Is TSMC exclusively dedicated to NVIDIA or is that a disputed claim?")
    assert strategy == RetrievalStrategy.CONTRADICTION_AWARE

    # GraphRAG routing
    strategy, _ = query_router.route_query("What is the partner ecosystem of OpenAI and Microsoft?")
    assert strategy == RetrievalStrategy.GRAPHRAG


def test_evidence_grounded_synthesis():
    req = RAGRequest(
        query="How does Cerebras wafer scale engine compare to NVIDIA GPUs for inference?",
        strategy=RetrievalStrategy.HYBRID,
        top_k=4
    )
    report = synthesizer.synthesize(req)
    assert report.direct_answer != ""
    assert report.confidence_score > 0.70
    assert len(report.executive_takeaways) > 0
    assert report.latency_ms > 0
