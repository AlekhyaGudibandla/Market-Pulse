from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class EventType(str, Enum):
    CHIP_ANNOUNCEMENT = "CHIP_ANNOUNCEMENT"
    PARTNERSHIP = "PARTNERSHIP"
    ACQUISITION = "ACQUISITION"
    PATENT_PUBLISHED = "PATENT_PUBLISHED"
    PRODUCT_RELEASE = "PRODUCT_RELEASE"
    BENCHMARK_CLAIM = "BENCHMARK_CLAIM"
    EXECUTIVE_MOVE = "EXECUTIVE_MOVE"
    SUPPLY_CHAIN_SHIFT = "SUPPLY_CHAIN_SHIFT"
    REGULATORY_FILING = "REGULATORY_FILING"


class EventSource(str, Enum):
    TECH_NEWS = "TECH_NEWS"
    COMPANY_BLOG = "COMPANY_BLOG"
    PATENT_OFFICE = "PATENT_OFFICE"
    PRODUCT_CHANGELOG = "PRODUCT_CHANGELOG"
    BENCHMARK_REGISTRY = "BENCHMARK_REGISTRY"
    SEC_FILING = "SEC_FILING"
    SIMULATED_FEED = "SIMULATED_FEED"


class RawEvent(BaseModel):
    id: str = Field(..., description="Unique event identifier or hash")
    title: str = Field(..., description="Headline or title of the announcement")
    content: str = Field(..., description="Full text or summary body")
    source: EventSource = Field(default=EventSource.TECH_NEWS)
    source_url: str = Field(default="", description="Canonical URL")
    author_or_publisher: str = Field(default="Unknown")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    content_hash: str = Field(..., description="SHA-256 fingerprint for deduplication")
    raw_metadata: Dict[str, Any] = Field(default_factory=dict)


class ExtractedClaim(BaseModel):
    statement: str
    confidence: float = 1.0
    evidence_snippet: str
    entities_involved: List[str] = Field(default_factory=list)


class NormalizedEvent(BaseModel):
    id: str
    raw_event_id: str
    event_type: EventType
    title: str
    summary: str
    source: EventSource
    source_url: str
    published_at: datetime
    processed_at: datetime = Field(default_factory=datetime.utcnow)
    extracted_entities: List[str] = Field(default_factory=list)
    relationships_detected: List[Dict[str, Any]] = Field(default_factory=list)
    claims: List[ExtractedClaim] = Field(default_factory=list)
    novelty_score: float = 0.0
    impact_score: float = 0.0
    is_genuine_novelty: bool = True
    deduplication_cluster_id: Optional[str] = None
