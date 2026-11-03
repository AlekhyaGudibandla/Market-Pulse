import pytest
from app.pipeline.resolution.resolver import entity_resolver
from app.models.entity import EntityType


def test_exact_canonical_match():
    match = entity_resolver.resolve_mention("NVIDIA Corporation")
    assert match.is_disambiguated is True
    assert match.resolved_id == "company_nvidia"
    assert match.confidence == 1.0


def test_alias_match():
    match = entity_resolver.resolve_mention("NVDA")
    assert match.is_disambiguated is True
    assert match.resolved_id == "company_nvidia"

    match_tsmc = entity_resolver.resolve_mention("Taiwan Semi")
    assert match_tsmc.is_disambiguated is True
    assert match_tsmc.resolved_id == "company_tsmc"


def test_fuzzy_resolution():
    match = entity_resolver.resolve_mention("Cerebras AI Systems")
    assert match.is_disambiguated is True
    assert match.resolved_id == "company_cerebras"
    assert match.confidence >= 0.78


def test_unresolved_segregation():
    match = entity_resolver.resolve_mention("Completely Unknown Quantum Tech Inc")
    assert match.is_disambiguated is False
    assert match.resolved_id is None
    assert match.match_strategy == "UNRESOLVED_QUEUE"
