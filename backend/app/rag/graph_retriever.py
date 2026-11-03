import logging
from typing import List, Dict, Any, Tuple
from app.pipeline.graph.graph_service import graph_service
from app.pipeline.resolution.resolver import entity_resolver
from app.models.query import EvidenceCitation

logger = logging.getLogger("marketpulse.rag.graph")


class GraphRAGRetriever:
    """
    GraphRAG Strategy:
    Traverses the Temporal Knowledge Graph to discover non-obvious multi-hop linkages
    between companies, chips, packaging technologies, and patents.
    """
    def __init__(self):
        self.graph = graph_service
        self.resolver = entity_resolver

    def retrieve(self, query: str, focus_entities: List[str] = None, max_hops: int = 2) -> Tuple[List[EvidenceCitation], Dict[str, Any]]:
        # Resolve entities in query if not explicitly passed
        target_entity_ids = list(focus_entities or [])
        if not target_entity_ids:
            all_canonical = self.resolver.get_all_canonical_entities()
            for ent in all_canonical:
                if ent.name.lower() in query.lower() or any(a.lower() in query.lower() for a in ent.aliases):
                    target_entity_ids.append(ent.id)

        if not target_entity_ids:
            # Default anchor to highest centrality company
            target_entity_ids = ["company_nvidia"]

        primary_id = target_entity_ids[0]
        neighborhood = self.graph.get_entity_neighborhood(primary_id, max_hops=max_hops)

        citations = []
        for i, edge in enumerate(neighborhood.get("edges", [])[:6]):
            src = self.graph.get_entity(edge["source"])
            tgt = self.graph.get_entity(edge["target"])
            s_name = src.name if src else edge["source"]
            t_name = tgt.name if tgt else edge["target"]
            rel_label = edge["relation_type"]

            excerpt = f"Graph Relation: {s_name} [{rel_label}] {t_name} (active since {edge.get('valid_since', '2024')[:10]}). Verified with {round(edge.get('confidence', 0.9)*100)}% confidence."
            citations.append(EvidenceCitation(
                citation_id=f"GRAPH-{i+1}",
                source_title=f"Knowledge Graph Edge: {s_name} -> {t_name}",
                source_url=f"https://marketpulse.ai/graph/explore?node={edge['source']}",
                published_date=edge.get("valid_since", "2024")[:10],
                excerpt=excerpt,
                reliability_weight=edge.get("confidence", 0.95),
                entity_references=[edge["source"], edge["target"]]
            ))

        return citations, neighborhood


graph_retriever = GraphRAGRetriever()
