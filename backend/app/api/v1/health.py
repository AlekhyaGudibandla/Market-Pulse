from fastapi import APIRouter
from app.pipeline.graph.graph_service import graph_service
from app.rag.vector_store import vector_store
from app.streaming.kafka_producer import event_bus
from app.streaming.reconciliation import reconciler
from app.config import settings

router = APIRouter()


@router.get("/health", summary="System health, pipeline lag, and subsystem status")
async def get_system_health():
    graph_stats = graph_service.get_stats()
    raw_msgs = event_bus.get_topic_messages(settings.KAFKA_RAW_TOPIC, limit=500)
    parsed_msgs = event_bus.get_topic_messages(settings.KAFKA_PARSED_TOPIC, limit=500)
    alerts_msgs = event_bus.get_topic_messages(settings.KAFKA_ALERTS_TOPIC, limit=500)
    dlq_msgs = event_bus.get_dlq_messages()

    return {
        "status": "HEALTHY",
        "version": settings.VERSION,
        "industry": settings.TARGET_INDUSTRY,
        "streaming_backbone": {
            "mode": "EMBEDDED_KRAFT" if settings.USE_EMBEDDED_KAFKA else "APACHE_KAFKA",
            "raw_events_queued": len(raw_msgs),
            "parsed_events_queued": len(parsed_msgs),
            "alerts_emitted": len(alerts_msgs),
            "dlq_count": len(dlq_msgs)
        },
        "temporal_knowledge_graph": {
            "mode": "NEO4J_ENTERPRISE" if graph_service.neo4j.is_connected else "RESILIENT_NETWORKX_TEMPORAL",
            "neo4j_connected": graph_service.neo4j.is_connected,
            "total_nodes": graph_stats["total_nodes"],
            "total_edges": graph_stats["total_edges"],
            "active_edges": graph_stats["active_edges"]
        },
        "vector_search_index": {
            "indexed_documents": vector_store.count(),
            "vector_dimension": settings.VECTOR_DIMENSION
        }
    }


@router.post("/reconcile", summary="Trigger state reconciliation between Kafka, Graph, and Vector indices")
async def trigger_reconciliation():
    reconciler.set_dependencies(graph_service, vector_store)
    report = await reconciler.run_reconciliation()
    return report.to_dict()
