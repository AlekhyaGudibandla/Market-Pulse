import logging
from typing import List, Dict, Any, Tuple
from app.pipeline.graph.graph_service import graph_service
from app.pipeline.resolution.resolver import entity_resolver
from app.models.query import EvidenceCitation

logger = logging.getLogger("marketpulse.rag.multihop")


class MultiHopRetriever:
    """
    Multi-Hop Retrieval Strategy:
    Follows relational dependency chains across multiple entities (e.g., Entity -> Tech -> Supplier -> Competitor)
    to investigate strategic hypotheses.
    """
    def __init__(self):
        self.graph = graph_service
        self.resolver = entity_resolver

    def retrieve(self, query: str, max_hops: int = 3) -> Tuple[List[EvidenceCitation], List[Dict[str, Any]]]:
        # Extract entities mentioned in query
        all_canonical = self.resolver.get_all_canonical_entities()
        matched = []
        for ent in all_canonical:
            if ent.name.lower() in query.lower() or any(a.lower() in query.lower() for a in ent.aliases):
                matched.append(ent.id)

        if len(matched) < 2:
            # Default hypothesis entities: NVIDIA and TSMC or Cerebras
            matched = ["company_openai", "company_tsmc"]

        start_id = matched[0]
        target_id = matched[1]

        # BFS path finding
        paths = self._find_paths(start_id, target_id, max_hops=max_hops)

        citations = []
        for i, path in enumerate(paths[:4]):
            path_desc = " -> ".join([
                f"{self.graph.get_entity(p[0]).name if self.graph.get_entity(p[0]) else p[0]} "
                f"[{p[1]}] -> "
                f"{self.graph.get_entity(p[2]).name if self.graph.get_entity(p[2]) else p[2]}"
                for p in path
            ])

            citations.append(EvidenceCitation(
                citation_id=f"HOP-{i+1}",
                source_title=f"Multi-Hop Relational Chain #{i+1}",
                source_url="https://marketpulse.ai/graph/pathfinder",
                published_date="2024",
                excerpt=f"Hypothesis Verification Path: {path_desc}",
                reliability_weight=0.92,
                entity_references=[p[0] for p in path] + [path[-1][2]]
            ))

        return citations, paths

    def _find_paths(self, start_id: str, target_id: str, max_hops: int = 3) -> List[List[Tuple[str, str, str]]]:
        """
        Returns list of edge-tuples: (source_id, relation_type, target_id)
        """
        all_rels = self.graph.get_all_relationships(active_only=True)
        # Build adjacency
        adj: Dict[str, List[Tuple[str, str]]] = {}
        for r in all_rels:
            if r.source_id not in adj:
                adj[r.source_id] = []
            if r.target_id not in adj:
                adj[r.target_id] = []
            adj[r.source_id].append((r.relation_type.value, r.target_id))
            adj[r.target_id].append((r.relation_type.value, r.source_id))

        paths = []
        queue = [([(start_id, "START", start_id)], {start_id})]

        while queue and len(paths) < 5:
            curr_path, visited = queue.pop(0)
            curr_node = curr_path[-1][2]

            if curr_node == target_id and len(curr_path) > 1:
                paths.append(curr_path[1:])  # Strip dummy start
                continue

            if len(curr_path) - 1 >= max_hops:
                continue

            for r_type, neighbor in adj.get(curr_node, []):
                if neighbor not in visited:
                    new_visited = set(visited)
                    new_visited.add(neighbor)
                    queue.append((curr_path + [(curr_node, r_type, neighbor)], new_visited))

        return paths


multi_hop_retriever = MultiHopRetriever()
