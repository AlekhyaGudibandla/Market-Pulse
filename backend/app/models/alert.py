from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class NoveltyScore(BaseModel):
    overall_novelty: float = Field(..., ge=0.0, le=1.0, description="0=identical repeat, 1=groundbreaking new info")
    semantic_distance: float = Field(..., ge=0.0, le=1.0, description="Distance from known prior announcements")
    graph_topology_delta: float = Field(..., ge=0.0, le=1.0, description="Novelty of graph edges/entities introduced")
    is_repeat: bool = False
    repeat_of_event_id: Optional[str] = None
    reasoning: str = ""


class AffectedCompetitor(BaseModel):
    competitor_id: str
    competitor_name: str
    threat_level: SeverityLevel
    overlap_area: str  # e.g., "Inference ASIC / Wafer Scale", "AI Code IDE", "LLM Serving"
    why_affected: str
    vulnerable_products: List[str] = Field(default_factory=list)
    graph_distance: int = 1  # 1 = direct competitor, 2 = competitor of customer/partner


class ImpactScore(BaseModel):
    overall_impact: float = Field(..., ge=0.0, le=1.0)
    centrality_shift: float = Field(0.0, ge=0.0, le=1.0)
    affected_competitors_count: int = 0
    severity: SeverityLevel = SeverityLevel.MEDIUM
    market_disruption_potential: str = "Moderate"
    rationale: str = ""


class IntelligenceAlert(BaseModel):
    id: str = Field(..., description="Unique alert identifier")
    event_id: str
    event_title: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Core Intelligence Explanations (What changed & Why it matters)
    what_changed: str = Field(..., description="Precise description of the landscape shift")
    why_it_matters: str = Field(..., description="Strategic and business significance")
    historical_context: str = Field(..., description="Synthesized prior events and lineage")
    
    # Quantitative Scores
    novelty: NoveltyScore
    impact: ImpactScore
    
    # Competitive Ripples
    primary_entity_id: str
    primary_entity_name: str
    affected_competitors: List[AffectedCompetitor] = Field(default_factory=list)
    affected_technologies: List[str] = Field(default_factory=list)
    
    # Traceable Evidence Chain
    evidence_chain: List[Dict[str, Any]] = Field(default_factory=list, description="Direct citations, sources, patents, snippets")
    remaining_uncertainties: List[str] = Field(default_factory=list, description="Unverified claims or pending disclosures")
    recommended_strategic_actions: List[str] = Field(default_factory=list)
    
    # Status
    is_pinned: bool = False
    is_acknowledged: bool = False
    tags: List[str] = Field(default_factory=list)
