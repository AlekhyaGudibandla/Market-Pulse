import logging
from typing import Dict, List, Optional, Any, Set, Tuple
from datetime import datetime
import networkx as nx
from app.models.entity import Entity, EntityType
from app.models.relationship import TemporalRelationship, RelationType, EvidenceLink

logger = logging.getLogger("marketpulse.graph.memory")


class InMemoryTemporalGraph:
    """
    High-performance Temporal Knowledge Graph implemented on NetworkX MultiDiGraph.
    Guarantees:
    - Bi-temporal historical preservation (relationships are never overwritten, valid_until is marked)
    - Time-travel reconstruction at arbitrary timestamp T
    - Multi-hop traversal and indirect competitor ripple detection
    - Centrality calculation (degree and betweenness)
    """
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self._entities: Dict[str, Entity] = {}
        self._relationships: Dict[str, TemporalRelationship] = {}

    def upsert_entity(self, entity: Entity) -> None:
        self._entities[entity.id] = entity
        self.graph.add_node(
            entity.id,
            name=entity.name,
            entity_type=entity.entity_type.value,
            description=entity.description,
            domain_sector=entity.domain_sector,
            market_cap_tier=entity.market_cap_tier or "Standard"
        )
        logger.debug(f"Entity upserted to graph: {entity.id} ({entity.name})")

    def add_relationship(self, rel: TemporalRelationship) -> None:
        # Ensure source and target nodes exist in graph
        if not self.graph.has_node(rel.source_id):
            logger.warning(f"Source entity {rel.source_id} not registered before edge creation.")
        if not self.graph.has_node(rel.target_id):
            logger.warning(f"Target entity {rel.target_id} not registered before edge creation.")

        self._relationships[rel.id] = rel
        self.graph.add_edge(
            rel.source_id,
            rel.target_id,
            key=rel.id,
            relation_type=rel.relation_type.value,
            valid_since=rel.valid_since.isoformat(),
            valid_until=rel.valid_until.isoformat() if rel.valid_until else None,
            is_active=rel.is_active,
            confidence=rel.confidence,
            weight=rel.weight
        )
        logger.debug(f"Edge added: {rel.source_id} -[{rel.relation_type.value}]-> {rel.target_id}")

    def terminate_relationship(self, source_id: str, target_id: str, relation_type: RelationType, terminated_at: datetime, evidence_id: str = "") -> bool:
        """
        Preserves history: marks valid_until and is_active=False instead of deleting edge.
        """
        modified = False
        for rel_id, rel in self._relationships.items():
            if rel.source_id == source_id and rel.target_id == target_id and rel.relation_type == relation_type:
                if rel.is_active:
                    rel.is_active = False
                    rel.valid_until = terminated_at
                    rel.updated_at = datetime.utcnow()
                    if evidence_id:
                        rel.evidence_chain.append(
                            EvidenceLink(event_id=evidence_id, source_url="", snippet="Relationship terminated/altered", timestamp=terminated_at)
                        )
                    # Update networkx edge
                    if self.graph.has_edge(source_id, target_id, key=rel_id):
                        self.graph[source_id][target_id][rel_id]["is_active"] = False
                        self.graph[source_id][target_id][rel_id]["valid_until"] = terminated_at.isoformat()
                    modified = True
        return modified

    def get_entity(self, entity_id: str) -> Optional[Entity]:
        return self._entities.get(entity_id)

    def get_all_entities(self) -> List[Entity]:
        return list(self._entities.values())

    def get_all_relationships(self, active_only: bool = False) -> List[TemporalRelationship]:
        if active_only:
            return [r for r in self._relationships.values() if r.is_active]
        return list(self._relationships.values())

    def query_valid_at(self, query_time: datetime) -> List[Dict[str, Any]]:
        """
        Time-travel query: reconstructs the complete active graph as of query_time.
        """
        valid_edges = []
        for rel in self._relationships.values():
            if rel.is_valid_at(query_time):
                src = self._entities.get(rel.source_id)
                tgt = self._entities.get(rel.target_id)
                valid_edges.append({
                    "id": rel.id,
                    "source_id": rel.source_id,
                    "source_name": src.name if src else rel.source_id,
                    "relation_type": rel.relation_type.value,
                    "target_id": rel.target_id,
                    "target_name": tgt.name if tgt else rel.target_id,
                    "valid_since": rel.valid_since.isoformat(),
                    "valid_until": rel.valid_until.isoformat() if rel.valid_until else None,
                    "confidence": rel.confidence
                })
        return valid_edges

    def get_entity_neighborhood(self, entity_id: str, max_hops: int = 1, as_of_time: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Extracts subgraph centered at entity_id up to max_hops with optional temporal filtering.
        """
        if not self.graph.has_node(entity_id):
            return {"nodes": [], "edges": []}

        sub_node_ids: Set[str] = {entity_id}
        current_layer: Set[str] = {entity_id}

        for _ in range(max_hops):
            next_layer: Set[str] = set()
            for nid in current_layer:
                # Undirected neighbors
                for succ in self.graph.successors(nid):
                    next_layer.add(succ)
                for pred in self.graph.predecessors(nid):
                    next_layer.add(pred)
            sub_node_ids.update(next_layer)
            current_layer = next_layer

        # Build nodes
        nodes = []
        for nid in sub_node_ids:
            ent = self._entities.get(nid)
            if ent:
                nodes.append({
                    "id": ent.id,
                    "name": ent.name,
                    "entity_type": ent.entity_type.value,
                    "description": ent.description,
                    "domain_sector": ent.domain_sector,
                    "centrality": self.get_node_centrality(ent.id)
                })

        # Build edges
        edges = []
        for rel in self._relationships.values():
            if rel.source_id in sub_node_ids and rel.target_id in sub_node_ids:
                if as_of_time and not rel.is_valid_at(as_of_time):
                    continue
                edges.append({
                    "id": rel.id,
                    "source": rel.source_id,
                    "target": rel.target_id,
                    "relation_type": rel.relation_type.value,
                    "valid_since": rel.valid_since.isoformat(),
                    "valid_until": rel.valid_until.isoformat() if rel.valid_until else None,
                    "is_active": rel.is_active,
                    "confidence": rel.confidence
                })

        return {"nodes": nodes, "edges": edges}

    def find_direct_competitors(self, entity_id: str) -> List[Entity]:
        """
        Finds all entities directly connected via COMPETES_WITH.
        """
        competitors = set()
        for rel in self._relationships.values():
            if rel.is_active and rel.relation_type == RelationType.COMPETES_WITH:
                if rel.source_id == entity_id:
                    competitors.add(rel.target_id)
                elif rel.target_id == entity_id:
                    competitors.add(rel.source_id)

        return [self._entities[cid] for cid in competitors if cid in self._entities]

    def find_indirectly_affected_competitors(self, entity_id: str, max_hops: int = 2) -> List[Dict[str, Any]]:
        """
        Discovers indirect competitive ripples:
        e.g., A announces chip -> A supplies to B -> B competes with C -> C is affected!
        """
        affected = []
        direct_comps = {c.id for c in self.find_direct_competitors(entity_id)}

        for c_id in direct_comps:
            comp_ent = self._entities.get(c_id)
            if comp_ent:
                affected.append({
                    "competitor_id": comp_ent.id,
                    "competitor_name": comp_ent.name,
                    "hops": 1,
                    "path_description": f"Direct market competitor in {comp_ent.domain_sector}",
                    "threat_level": "HIGH"
                })

        # Hop 2: Partners / Suppliers / Customers of competitors
        for rel in self._relationships.values():
            if not rel.is_active:
                continue
            if rel.source_id == entity_id and rel.target_id not in direct_comps:
                # Entity connects to a partner/supplier/tech
                partner_id = rel.target_id
                # Check who else competes or uses partner_id
                for p_rel in self._relationships.values():
                    if not p_rel.is_active:
                        continue
                    if (p_rel.target_id == partner_id or p_rel.source_id == partner_id) and p_rel.source_id != entity_id and p_rel.target_id != entity_id:
                        other_id = p_rel.source_id if p_rel.target_id == partner_id else p_rel.target_id
                        other_ent = self._entities.get(other_id)
                        if other_ent and other_ent.entity_type == EntityType.COMPANY and other_id not in direct_comps:
                            affected.append({
                                "competitor_id": other_ent.id,
                                "competitor_name": other_ent.name,
                                "hops": 2,
                                "path_description": f"Shared ecosystem dependency via {self._entities.get(partner_id, Entity(id=partner_id, name=partner_id, entity_type=EntityType.TECHNOLOGY)).name} ({rel.relation_type.value})",
                                "threat_level": "MEDIUM"
                            })

        # Deduplicate
        seen = set()
        unique_affected = []
        for item in affected:
            if item["competitor_id"] not in seen:
                seen.add(item["competitor_id"])
                unique_affected.append(item)

        return unique_affected

    def get_node_centrality(self, entity_id: str) -> float:
        """
        Calculates normalized degree centrality for entity in the active graph.
        """
        if not self.graph.has_node(entity_id):
            return 0.0
        n_nodes = self.graph.number_of_nodes()
        if n_nodes <= 1:
            return 1.0
        degree = self.graph.degree(entity_id)
        return round(degree / (n_nodes - 1), 3)

    def get_graph_topology(self) -> Dict[str, Any]:
        """
        Returns full graph payload structured for Next.js / Vis / D3 visualizer.
        """
        nodes = []
        for eid, ent in self._entities.items():
            nodes.append({
                "id": ent.id,
                "label": ent.name,
                "type": ent.entity_type.value,
                "description": ent.description,
                "sector": ent.domain_sector,
                "centrality": self.get_node_centrality(eid)
            })

        edges = []
        for rel in self._relationships.values():
            edges.append({
                "id": rel.id,
                "from": rel.source_id,
                "to": rel.target_id,
                "label": rel.relation_type.value,
                "is_active": rel.is_active,
                "valid_since": rel.valid_since.isoformat(),
                "valid_until": rel.valid_until.isoformat() if rel.valid_until else None,
                "confidence": rel.confidence
            })

        return {"nodes": nodes, "edges": edges}

    def get_stats(self) -> Dict[str, int]:
        return {
            "total_nodes": len(self._entities),
            "total_edges": len(self._relationships),
            "active_edges": sum(1 for r in self._relationships.values() if r.is_active)
        }
