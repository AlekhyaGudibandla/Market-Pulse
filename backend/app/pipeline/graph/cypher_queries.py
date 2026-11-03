"""
Production Cypher queries for Neo4j Temporal Knowledge Graph in MarketPulse.
Ensures bi-temporal validity, multi-hop relationship exploration, and idempotent mutations.
"""

UPSERT_ENTITY_CYPHER = """
MERGE (e:Entity {id: $id})
ON CREATE SET 
    e.name = $name,
    e.entity_type = $entity_type,
    e.aliases = $aliases,
    e.description = $description,
    e.domain_sector = $domain_sector,
    e.created_at = datetime(),
    e.updated_at = datetime()
ON MATCH SET
    e.name = $name,
    e.aliases = $aliases,
    e.updated_at = datetime()
RETURN e
"""

ADD_TEMPORAL_RELATIONSHIP_CYPHER = """
MATCH (source:Entity {id: $source_id})
MATCH (target:Entity {id: $target_id})
MERGE (source)-[r:TEMPORAL_RELATION {
    relation_type: $relation_type,
    valid_since: datetime($valid_since)
}]->(target)
ON CREATE SET
    r.id = $edge_id,
    r.valid_until = CASE WHEN $valid_until IS NOT NULL THEN datetime($valid_until) ELSE null END,
    r.is_active = $is_active,
    r.confidence = $confidence,
    r.weight = $weight,
    r.evidence_event_ids = [$event_id],
    r.created_at = datetime(),
    r.updated_at = datetime()
ON MATCH SET
    r.confidence = $confidence,
    r.evidence_event_ids = apoc.coll.toSet(r.evidence_event_ids + [$event_id]),
    r.updated_at = datetime()
RETURN r
"""

TERMINATE_RELATIONSHIP_CYPHER = """
MATCH (source:Entity {id: $source_id})-[r:TEMPORAL_RELATION {relation_type: $relation_type}]->(target:Entity {id: $target_id})
WHERE r.valid_until IS NULL OR r.is_active = true
SET 
    r.valid_until = datetime($terminated_at),
    r.is_active = false,
    r.termination_evidence_id = $event_id,
    r.updated_at = datetime()
RETURN r
"""

QUERY_VALID_AT_TIME_CYPHER = """
MATCH (s:Entity)-[r:TEMPORAL_RELATION]->(t:Entity)
WHERE r.valid_since <= datetime($query_time)
  AND (r.valid_until IS NULL OR r.valid_until >= datetime($query_time))
RETURN s.id AS source_id, s.name AS source_name, s.entity_type AS source_type,
       r.relation_type AS relation, r.confidence AS confidence, r.valid_since AS valid_since,
       t.id AS target_id, t.name AS target_name, t.entity_type AS target_type
"""

MULTI_HOP_COMPETITOR_IMPACT_CYPHER = """
MATCH (focus:Entity {id: $entity_id})
MATCH (focus)-[r1:TEMPORAL_RELATION*1..2]-(mid:Entity)
WHERE ALL(rel IN r1 WHERE rel.is_active = true)
MATCH (mid)-[r2:TEMPORAL_RELATION {relation_type: 'COMPETES_WITH'}]-(competitor:Entity)
WHERE competitor.id <> focus.id AND r2.is_active = true
RETURN DISTINCT competitor.id AS competitor_id, competitor.name AS competitor_name,
       mid.id AS mediator_id, mid.name AS mediator_name,
       length(r1) + 1 AS hops
LIMIT 20
"""

GET_NEIGHBORHOOD_SUBGRAPH_CYPHER = """
MATCH (e:Entity {id: $entity_id})-[r:TEMPORAL_RELATION]-(neighbor:Entity)
WHERE r.is_active = true
RETURN e, r, neighbor
LIMIT 50
"""
