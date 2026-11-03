import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from app.models.entity import Entity
from app.models.relationship import TemporalRelationship, RelationType
from app.pipeline.graph.memory_graph import InMemoryTemporalGraph
from app.pipeline.graph.neo4j_client import neo4j_client
from app.pipeline.graph.cypher_queries import (
    UPSERT_ENTITY_CYPHER,
    ADD_TEMPORAL_RELATIONSHIP_CYPHER,
    TERMINATE_RELATIONSHIP_CYPHER,
    QUERY_VALID_AT_TIME_CYPHER,
    MULTI_HOP_COMPETITOR_IMPACT_CYPHER,
    GET_NEIGHBORHOOD_SUBGRAPH_CYPHER
)
from app.config import settings

logger = logging.getLogger("marketpulse.graph.service")


class TemporalGraphService:
    """
    Unified Temporal Knowledge Graph Service:
    - Provides single unified API across In-Memory NetworkX and Neo4j
    - Writes to both when Neo4j is available (dual-write consistency)
    - Serves sub-millisecond graph queries, temporal slices, and multi-hop traversals
    """
    def __init__(self):
        self.memory_graph = InMemoryTemporalGraph()
        self.neo4j = neo4j_client

    def upsert_entity(self, entity: Entity) -> None:
        self.memory_graph.upsert_entity(entity)
        if self.neo4j.is_connected:
            try:
                self.neo4j.execute_query(
                    UPSERT_ENTITY_CYPHER,
                    {
                        "id": entity.id,
                        "name": entity.name,
                        "entity_type": entity.entity_type.value,
                        "aliases": entity.aliases,
                        "description": entity.description,
                        "domain_sector": entity.domain_sector
                    }
                )
            except Exception as e:
                logger.error(f"Neo4j entity upsert error: {e}")

    def add_relationship(self, rel: TemporalRelationship) -> None:
        self.memory_graph.add_relationship(rel)
        if self.neo4j.is_connected:
            try:
                self.neo4j.execute_query(
                    ADD_TEMPORAL_RELATIONSHIP_CYPHER,
                    {
                        "source_id": rel.source_id,
                        "target_id": rel.target_id,
                        "edge_id": rel.id,
                        "relation_type": rel.relation_type.value,
                        "valid_since": rel.valid_since.isoformat(),
                        "valid_until": rel.valid_until.isoformat() if rel.valid_until else None,
                        "is_active": rel.is_active,
                        "confidence": rel.confidence,
                        "weight": rel.weight,
                        "event_id": rel.evidence_chain[0].event_id if rel.evidence_chain else "unknown"
                    }
                )
            except Exception as e:
                logger.error(f"Neo4j relationship add error: {e}")

    def terminate_relationship(self, source_id: str, target_id: str, relation_type: RelationType, terminated_at: datetime, evidence_id: str = "") -> bool:
        res = self.memory_graph.terminate_relationship(source_id, target_id, relation_type, terminated_at, evidence_id)
        if self.neo4j.is_connected:
            try:
                self.neo4j.execute_query(
                    TERMINATE_RELATIONSHIP_CYPHER,
                    {
                        "source_id": source_id,
                        "target_id": target_id,
                        "relation_type": relation_type.value,
                        "terminated_at": terminated_at.isoformat(),
                        "event_id": evidence_id
                    }
                )
            except Exception as e:
                logger.error(f"Neo4j terminate relation error: {e}")
        return res

    def get_entity(self, entity_id: str) -> Optional[Entity]:
        return self.memory_graph.get_entity(entity_id)

    def get_all_entities(self) -> List[Entity]:
        return self.memory_graph.get_all_entities()

    def get_all_relationships(self, active_only: bool = False) -> List[TemporalRelationship]:
        return self.memory_graph.get_all_relationships(active_only=active_only)

    def query_valid_at(self, query_time: datetime) -> List[Dict[str, Any]]:
        return self.memory_graph.query_valid_at(query_time)

    def get_entity_neighborhood(self, entity_id: str, max_hops: int = 1, as_of_time: Optional[datetime] = None) -> Dict[str, Any]:
        return self.memory_graph.get_entity_neighborhood(entity_id, max_hops, as_of_time)

    def find_direct_competitors(self, entity_id: str) -> List[Entity]:
        return self.memory_graph.find_direct_competitors(entity_id)

    def find_indirectly_affected_competitors(self, entity_id: str, max_hops: int = 2) -> List[Dict[str, Any]]:
        return self.memory_graph.find_indirectly_affected_competitors(entity_id, max_hops)

    def get_node_centrality(self, entity_id: str) -> float:
        return self.memory_graph.get_node_centrality(entity_id)

    def get_graph_topology(self) -> Dict[str, Any]:
        return self.memory_graph.get_graph_topology()

    def get_stats(self) -> Dict[str, int]:
        return self.memory_graph.get_stats()


graph_service = TemporalGraphService()
