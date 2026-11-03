from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class EntityType(str, Enum):
    COMPANY = "COMPANY"
    TECHNOLOGY = "TECHNOLOGY"
    PRODUCT = "PRODUCT"
    PATENT = "PATENT"
    BENCHMARK = "BENCHMARK"
    PERSON = "PERSON"


class Entity(BaseModel):
    id: str = Field(..., description="Unique canonical entity ID, e.g., company_nvidia")
    name: str = Field(..., description="Canonical display name, e.g., NVIDIA Corporation")
    entity_type: EntityType
    aliases: List[str] = Field(default_factory=list, description="Known synonyms, tickers, abbreviations")
    description: str = ""
    domain_sector: str = Field(default="AI Infrastructure & Developer Tools")
    founded_or_created: Optional[str] = None
    headquarters: Optional[str] = None
    market_cap_tier: Optional[str] = None  # Megacap, Large, Mid, Startup, VC-backed
    metadata: Dict[str, Any] = Field(default_factory=dict)
    centrality_score: float = Field(default=0.0, description="Degree or PageRank centrality in knowledge graph")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CanonicalEntity(BaseModel):
    canonical_id: str
    primary_name: str
    entity_type: EntityType
    aliases: List[str] = Field(default_factory=list)
    confidence: float = 1.0


class EntityResolutionMatch(BaseModel):
    raw_mention: str
    resolved_id: Optional[str] = None
    resolved_name: Optional[str] = None
    entity_type: Optional[EntityType] = None
    confidence: float = 0.0
    is_disambiguated: bool = False
    match_strategy: str = "EXACT"  # EXACT, ALIAS_MAP, FUZZY, EMBEDDING, UNRESOLVED_QUEUE
    candidate_matches: List[Dict[str, Any]] = Field(default_factory=list)
