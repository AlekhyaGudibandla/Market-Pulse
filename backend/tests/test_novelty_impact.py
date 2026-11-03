import pytest
from datetime import datetime
from app.models.event import NormalizedEvent, EventType, EventSource
from app.pipeline.change_detection.novelty_scorer import NoveltyScoringEngine
from app.pipeline.change_detection.impact_analyzer import ImpactAnalyzerEngine
from app.pipeline.graph.graph_service import graph_service
from app.seed.ai_infrastructure_seed import seed_knowledge_base


def test_novelty_scorer_and_syndication_suppression():
    scorer = NoveltyScoringEngine()
    ev1 = NormalizedEvent(
        id="norm_test_1",
        raw_event_id="raw_1",
        event_type=EventType.CHIP_ANNOUNCEMENT,
        title="NVIDIA Announces Blackwell Ultra Chip",
        summary="NVIDIA reveals next gen accelerator with high memory bandwidth.",
        source=EventSource.COMPANY_BLOG,
        source_url="https://nvidia.com/b300",
        published_at=datetime.utcnow(),
        extracted_entities=["company_nvidia", "product_b200"]
    )

    score1 = scorer.evaluate_novelty(ev1)
    assert score1.is_repeat is False
    assert score1.overall_novelty > 0.5

    # Ingest near-identical syndicated report
    ev2 = NormalizedEvent(
        id="norm_test_2",
        raw_event_id="raw_2",
        event_type=EventType.CHIP_ANNOUNCEMENT,
        title="NVIDIA Announces Blackwell Ultra Chip in Press Release",
        summary="NVIDIA announces their Blackwell Ultra accelerator.",
        source=EventSource.TECH_NEWS,
        source_url="https://technews.com/nvidia-b300",
        published_at=datetime.utcnow(),
        extracted_entities=["company_nvidia", "product_b200"]
    )

    score2 = scorer.evaluate_novelty(ev2)
    assert score2.is_repeat is True
    assert score2.overall_novelty < 0.5


def test_impact_analysis_ripple_detection():
    seed_knowledge_base()
    analyzer = ImpactAnalyzerEngine()
    ev = NormalizedEvent(
        id="norm_test_impact",
        raw_event_id="raw_impact",
        event_type=EventType.CHIP_ANNOUNCEMENT,
        title="Cerebras Launches CS-3 Wafer Scale Engine",
        summary="Cerebras launches 4 trillion transistor chip to challenge NVIDIA.",
        source=EventSource.TECH_NEWS,
        source_url="https://cerebras.ai",
        published_at=datetime.utcnow(),
        extracted_entities=["company_cerebras"]
    )

    impact, affected, primary_id = analyzer.analyze_impact(ev)
    assert impact.overall_impact >= 0.40
    assert len(affected) > 0
    assert any(a.competitor_id == "company_nvidia" for a in affected)
