from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class RelationType(str, Enum):
    PARTNERED_WITH = "PARTNERED_WITH"
    COMPETES_WITH = "COMPETES_WITH"
    RELEASED = "RELEASED"
    ACQUIRED = "ACQUISITION_OF"
    SUPPLIES_TO = "SUPPLIES_TO"
    USES = "USES"
    FILED_PATENT = "FILED_PATENT"
    LICENSED_TO = "LICENSED_TO"
    HIRED_FROM = "HIRED_FROM"
    BENCHMARKS_AGAINST = "BENCHMARKS_AGAINST"


class EvidenceLink(BaseModel):
    event_id: str
    source_url: str
    snippet: str
    timestamp: datetime
    confidence: float = 1.0


class TemporalRelationship(BaseModel):
    id: str = Field(..., description="Unique edge identifier")
    source_id: str = Field(..., description="Canonical source entity ID")
    target_id: str = Field(..., description="Canonical target entity ID")
    relation_type: RelationType
    valid_since: datetime = Field(default_factory=datetime.utcnow)
    valid_until: Optional[datetime] = None  # None indicates ongoing relationship
    is_active: bool = True
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    weight: float = Field(default=1.0, ge=0.0)
    evidence_chain: List[EvidenceLink] = Field(default_factory=list)
    properties: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def is_valid_at(self, query_time: datetime) -> bool:
        """Evaluates bi-temporal validity of this relationship at timestamp query_time."""
        if self.valid_since > query_time:
            return False
        if self.valid_until and self.valid_until < query_time:
            return False
        return True
