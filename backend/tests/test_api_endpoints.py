import pytest
import httpx
from app.main import app
from app.seed.ai_infrastructure_seed import seed_knowledge_base
from app.pipeline.ingestion.simulated_stream import pipeline_service


@pytest.mark.asyncio
async def test_root_and_health_endpoints():
    seed_knowledge_base()
    await pipeline_service.bootstrap_initial_events()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Test Root
        root_res = await client.get("/")
        assert root_res.status_code == 200
        assert "MarketPulse" in root_res.json()["product"]

        # Test Health
        health_res = await client.get("/api/v1/health")
        assert health_res.status_code == 200
        data = health_res.json()
        assert data["status"] == "HEALTHY"
        assert data["temporal_knowledge_graph"]["total_nodes"] > 0

        # Test Alerts Feed
        alerts_res = await client.get("/api/v1/alerts")
        assert alerts_res.status_code == 200
        assert alerts_res.json()["count"] > 0

        # Test Graph Topology
        graph_res = await client.get("/api/v1/graph/topology")
        assert graph_res.status_code == 200
        assert len(graph_res.json()["nodes"]) > 0

        # Test Competitor Matrix
        matrix_res = await client.get("/api/v1/competitors/matrix")
        assert matrix_res.status_code == 200
        assert len(matrix_res.json()["companies"]) > 0

        # Test Intelligence RAG Query
        rag_res = await client.post(
            "/api/v1/intelligence/query",
            json={"query": "How does Cerebras compare to NVIDIA?"}
        )
        assert rag_res.status_code == 200
        rag_data = rag_res.json()
        assert "direct_answer" in rag_data
        assert len(rag_data["citations"]) > 0

        # Test Change-Impact Simulation
        impact_res = await client.post(
            "/api/v1/intelligence/change-impact",
            json={
                "title": "Hypothetical Deal: Groq contracts TSMC for 3nm wafer run",
                "content": "Groq enters high-volume manufacturing contract with TSMC."
            }
        )
        assert impact_res.status_code == 200
        assert "impact" in impact_res.json()
