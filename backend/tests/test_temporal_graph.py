import pytest
from datetime import datetime, timedelta
from app.models.relationship import TemporalRelationship, RelationType
from app.pipeline.graph.memory_graph import InMemoryTemporalGraph
from app.models.entity import Entity, EntityType


def test_temporal_validity_and_history_preservation():
    g = InMemoryTemporalGraph()
    e1 = Entity(id="comp_a", name="Company A", entity_type=EntityType.COMPANY)
    e2 = Entity(id="comp_b", name="Company B", entity_type=EntityType.COMPANY)
    g.upsert_entity(e1)
    g.upsert_entity(e2)

    t_start = datetime(2022, 1, 1)
    t_end = datetime(2023, 1, 1)
    t_query_active = datetime(2022, 6, 1)
    t_query_expired = datetime(2023, 6, 1)

    rel = TemporalRelationship(
        id="rel_ab",
        source_id="comp_a",
        target_id="comp_b",
        relation_type=RelationType.PARTNERED_WITH,
        valid_since=t_start,
        valid_until=t_end,
        is_active=False
    )
    g.add_relationship(rel)

    # Valid during interval
    assert rel.is_valid_at(t_query_active) is True
    # Expired after interval
    assert rel.is_valid_at(t_query_expired) is False


def test_terminate_relationship_preserves_history():
    g = InMemoryTemporalGraph()
    e1 = Entity(id="c1", name="C1", entity_type=EntityType.COMPANY)
    e2 = Entity(id="c2", name="C2", entity_type=EntityType.COMPANY)
    g.upsert_entity(e1)
    g.upsert_entity(e2)

    rel = TemporalRelationship(
        id="rel_12",
        source_id="c1",
        target_id="c2",
        relation_type=RelationType.SUPPLIES_TO,
        valid_since=datetime(2023, 1, 1),
        is_active=True
    )
    g.add_relationship(rel)

    # Terminate partnership
    term_time = datetime(2024, 1, 1)
    res = g.terminate_relationship("c1", "c2", RelationType.SUPPLIES_TO, term_time, "evt_term_01")
    assert res is True

    # Check edge is preserved but inactive
    all_rels = g.get_all_relationships()
    assert len(all_rels) == 1
    assert all_rels[0].is_active is False
    assert all_rels[0].valid_until == term_time
