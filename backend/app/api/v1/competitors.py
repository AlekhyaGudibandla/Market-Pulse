from fastapi import APIRouter, HTTPException
from app.pipeline.graph.graph_service import graph_service
from app.models.entity import EntityType
from app.models.relationship import RelationType

router = APIRouter()


@router.get("/matrix", summary="Competitive landscape matrix for AI Infrastructure & Developer Tools")
async def get_competitor_matrix():
    all_entities = graph_service.get_all_entities()
    companies = [e for e in all_entities if e.entity_type == EntityType.COMPANY]
    
    matrix = []
    for c in companies:
        direct_comps = graph_service.find_direct_competitors(c.id)
        # Find active products released
        rels = graph_service.get_all_relationships(active_only=True)
        products = []
        partners = []
        for r in rels:
            if r.source_id == c.id and r.relation_type == RelationType.RELEASED:
                p_ent = graph_service.get_entity(r.target_id)
                if p_ent:
                    products.append(p_ent.name)
            elif r.source_id == c.id and r.relation_type == RelationType.PARTNERED_WITH:
                partner_ent = graph_service.get_entity(r.target_id)
                if partner_ent:
                    partners.append(partner_ent.name)
            elif r.target_id == c.id and r.relation_type == RelationType.PARTNERED_WITH:
                partner_ent = graph_service.get_entity(r.source_id)
                if partner_ent:
                    partners.append(partner_ent.name)

        matrix.append({
            "id": c.id,
            "name": c.name,
            "domain_sector": c.domain_sector,
            "centrality_score": graph_service.get_node_centrality(c.id),
            "flagship_products": products,
            "key_partners": partners,
            "direct_competitors": [dc.name for dc in direct_comps],
            "headquarters": c.headquarters,
            "market_tier": c.market_cap_tier
        })

    matrix.sort(key=lambda x: x["centrality_score"], reverse=True)
    return {"companies": matrix}


@router.get("/{entity_id}/ripples", summary="Get multi-hop competitive ripples for an entity")
async def get_competitor_ripples(entity_id: str):
    ent = graph_service.get_entity(entity_id)
    if not ent:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")

    ripples = graph_service.find_indirectly_affected_competitors(entity_id, max_hops=2)
    return {
        "entity_id": ent.id,
        "entity_name": ent.name,
        "ripples": ripples
    }
