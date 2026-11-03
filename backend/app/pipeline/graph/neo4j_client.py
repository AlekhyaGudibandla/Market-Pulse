import logging
from typing import Dict, Any, List, Optional
from neo4j import GraphDatabase, Driver
from app.config import settings

logger = logging.getLogger("marketpulse.graph.neo4j")


class Neo4jClient:
    """
    Production Neo4j Driver managing connection pool, Cypher transactions,
    and bi-temporal graph queries.
    """
    def __init__(self):
        self.driver: Optional[Driver] = None
        self.is_connected = False
        self._init_connection()

    def _init_connection(self):
        if settings.USE_EMBEDDED_GRAPH:
            self.is_connected = False
            logger.info("Running in resilient embedded graph mode (NetworkX temporal multi-graph).")
            return
        try:
            self.driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
                connection_timeout=2.0
            )
            self.driver.verify_connectivity()
            self.is_connected = True
            logger.info(f"Connected successfully to Neo4j at {settings.NEO4J_URI}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"Neo4j connection deferred (running in resilient embedded mode): {e}")

    def execute_query(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if not self.is_connected or not self.driver:
            return []
        try:
            with self.driver.session() as session:
                result = session.run(query, parameters or {})
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Error executing Cypher query: {e}")
            return []

    def close(self):
        if self.driver:
            self.driver.close()
            self.is_connected = False


neo4j_client = Neo4jClient()
