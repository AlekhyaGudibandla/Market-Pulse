from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Query, HTTPException
from app.pipeline.graph.graph_service import graph_service

router = APIRouter()


@router.get("/topology", summary="Retrieve full knowledge graph topology for visualizer")
async def get_graph_topology():
    return graph_service.get_graph_topology()


@router.get("/entity/{entity_id}/subgraph", summary="Extract neighborhood subgraph around an entity")
async def get_entity_subgraph(
    entity_id: str,
    hops: int = Query(default=1, ge=1, le=3),
    as_of: Optional[str] = Query(None, description="ISO timestamp for historical reconstruction")
):
    as_of_time = None
    if as_of:
        try:
            as_of_time = datetime.fromisoformat(as_of)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid ISO timestamp for as_of parameter")

    return graph_service.get_entity_neighborhood(entity_id=entity_id, max_hops=hops, as_of_time=as_of_time)


@router.get("/temporal-slice", summary="Reconstruct complete active graph state at historical timestamp")
async def get_temporal_slice(as_of: str = Query(..., description="ISO timestamp, e.g. 2023-06-01T00:00:00")):
    try:
        t = datetime.fromisoformat(as_of)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ISO timestamp format")
    
    valid_edges = graph_service.query_valid_at(t)
    return {
        "as_of": t.isoformat(),
        "edge_count": len(valid_edges),
        "edges": valid_edges
    }


@router.get("/centrality", summary="Get centrality ranking across all landscape entities")
async def get_centrality_rankings():
    entities = graph_service.get_all_entities()
    rankings = []
    for ent in entities:
        cent = graph_service.get_node_centrality(ent.id)
        rankings.append({
            "id": ent.id,
            "name": ent.name,
            "type": ent.entity_type.value,
            "sector": ent.domain_sector,
            "centrality_score": cent
        })
    rankings.sort(key=lambda x: x["centrality_score"], reverse=True)
    return {"rankings": rankings}
