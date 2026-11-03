import logging
from typing import Dict, Any, List
from datetime import datetime
from app.streaming.kafka_producer import event_bus
from app.config import settings

logger = logging.getLogger("marketpulse.reconciliation")


class ReconciliationReport:
    def __init__(self):
        self.timestamp = datetime.utcnow()
        self.kafka_raw_count: int = 0
        self.kafka_parsed_count: int = 0
        self.graph_nodes_count: int = 0
        self.graph_edges_count: int = 0
        self.vector_docs_count: int = 0
        self.dlq_count: int = 0
        self.discrepancies: List[str] = []
        self.repaired_items: int = 0
        self.is_healthy: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp.isoformat(),
            "kafka_raw_count": self.kafka_raw_count,
            "kafka_parsed_count": self.kafka_parsed_count,
            "graph_nodes_count": self.graph_nodes_count,
            "graph_edges_count": self.graph_edges_count,
            "vector_docs_count": self.vector_docs_count,
            "dlq_count": self.dlq_count,
            "discrepancies": self.discrepancies,
            "repaired_items": self.repaired_items,
            "is_healthy": self.is_healthy
        }


class StateReconciler:
    """
    Periodically checks parity between Kafka events, Neo4j Temporal Graph,
    and Vector/Keyword search indices. Detects ghost records or missing documents.
    """
    def __init__(self, graph_service=None, vector_store=None):
        self.graph_service = graph_service
        self.vector_store = vector_store

    def set_dependencies(self, graph_service, vector_store):
        self.graph_service = graph_service
        self.vector_store = vector_store

    async def run_reconciliation(self) -> ReconciliationReport:
        report = ReconciliationReport()
        raw_msgs = event_bus.get_topic_messages(settings.KAFKA_RAW_TOPIC, limit=1000)
        parsed_msgs = event_bus.get_topic_messages(settings.KAFKA_PARSED_TOPIC, limit=1000)
        dlq_msgs = event_bus.get_dlq_messages()

        report.kafka_raw_count = len(raw_msgs)
        report.kafka_parsed_count = len(parsed_msgs)
        report.dlq_count = len(dlq_msgs)

        if self.graph_service:
            stats = self.graph_service.get_stats()
            report.graph_nodes_count = stats.get("total_nodes", 0)
            report.graph_edges_count = stats.get("total_edges", 0)

        if self.vector_store:
            report.vector_docs_count = self.vector_store.count()

        # Check for discrepancies
        if report.kafka_raw_count > 0 and report.kafka_parsed_count == 0:
            msg = "Kafka raw events exist but no parsed events recorded."
            report.discrepancies.append(msg)
            report.is_healthy = False

        if report.dlq_count > 5:
            msg = f"DLQ has accumulated {report.dlq_count} failed poison pill messages."
            report.discrepancies.append(msg)
            report.is_healthy = False

        if self.vector_store and self.graph_service:
            # Check if vector docs roughly track parsed events
            if abs(report.kafka_parsed_count - report.vector_docs_count) > 10:
                report.discrepancies.append(
                    f"Drift detected between Parsed Kafka Events ({report.kafka_parsed_count}) and Vector Index ({report.vector_docs_count})"
                )

        logger.info(f"Reconciliation check completed: healthy={report.is_healthy}, issues={len(report.discrepancies)}")
        return report


reconciler = StateReconciler()
