from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class RetrievalStrategy(str, Enum):
    HYBRID = "HYBRID"
    GRAPHRAG = "GRAPHRAG"
    TEMPORAL = "TEMPORAL"
    EVENT_CENTRIC = "EVENT_CENTRIC"
    MULTI_HOP = "MULTI_HOP"
    CONTRADICTION_AWARE = "CONTRADICTION_AWARE"
    QUERY_ADAPTIVE = "QUERY_ADAPTIVE"
    EVIDENCE_GROUNDED = "EVIDENCE_GROUNDED"


class RAGRequest(BaseModel):
    query: str = Field(..., description="Intelligence question or hypothesis to investigate")
    strategy: RetrievalStrategy = Field(default=RetrievalStrategy.QUERY_ADAPTIVE)
    as_of_time: Optional[datetime] = Field(None, description="For temporal queries: reconstruct landscape as of this timestamp")
    focus_entities: List[str] = Field(default_factory=list, description="Target entity IDs to anchor traversal")
    max_hops: int = Field(default=2, ge=1, le=4)
    top_k: int = Field(default=8, ge=1, le=30)
    include_graph_subgraph: bool = True


class EvidenceCitation(BaseModel):
    citation_id: str
    source_title: str
    source_url: str
    published_date: str
    excerpt: str
    reliability_weight: float = 1.0
    entity_references: List[str] = Field(default_factory=list)


class ContradictionReport(BaseModel):
    has_conflicts: bool = False
    topic: str = ""
    claim_a: str = ""
    source_a: str = ""
    claim_b: str = ""
    source_b: str = ""
    analysis: str = ""


class GroundedSynthesisReport(BaseModel):
    query: str
    selected_strategy: RetrievalStrategy
    strategy_rationale: str
    direct_answer: str
    synthesis_markdown: str
    executive_takeaways: List[str] = Field(default_factory=list)
    citations: List[EvidenceCitation] = Field(default_factory=list)
    subgraph_nodes: List[Dict[str, Any]] = Field(default_factory=list)
    subgraph_edges: List[Dict[str, Any]] = Field(default_factory=list)
    temporal_anchor: Optional[str] = None
    contradictions: Optional[ContradictionReport] = None
    confidence_score: float = 0.92
    latency_ms: float = 0.0
