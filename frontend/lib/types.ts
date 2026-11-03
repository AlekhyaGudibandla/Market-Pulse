export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type EventType =
  | "CHIP_ANNOUNCEMENT"
  | "PARTNERSHIP"
  | "ACQUISITION"
  | "PATENT_PUBLISHED"
  | "PRODUCT_RELEASE"
  | "BENCHMARK_CLAIM"
  | "EXECUTIVE_MOVE"
  | "SUPPLY_CHAIN_SHIFT";

export type RetrievalStrategy =
  | "HYBRID"
  | "GRAPHRAG"
  | "TEMPORAL"
  | "EVENT_CENTRIC"
  | "MULTI_HOP"
  | "CONTRADICTION_AWARE"
  | "QUERY_ADAPTIVE"
  | "EVIDENCE_GROUNDED";

export interface NoveltyScore {
  overall_novelty: number;
  semantic_distance: number;
  graph_topology_delta: number;
  is_repeat: boolean;
  repeat_of_event_id?: string;
  reasoning: string;
}

export interface AffectedCompetitor {
  competitor_id: string;
  competitor_name: string;
  threat_level: SeverityLevel;
  overlap_area: string;
  why_affected: string;
  vulnerable_products?: string[];
  graph_distance: number;
}

export interface ImpactScore {
  overall_impact: number;
  centrality_shift: number;
  affected_competitors_count: number;
  severity: SeverityLevel;
  market_disruption_potential: string;
  rationale: string;
}

export interface IntelligenceAlert {
  id: string;
  event_id: string;
  event_title: string;
  timestamp: string;
  what_changed: string;
  why_it_matters: string;
  historical_context: string;
  novelty: NoveltyScore;
  impact: ImpactScore;
  primary_entity_id: string;
  primary_entity_name: string;
  affected_competitors: AffectedCompetitor[];
  affected_technologies: string[];
  evidence_chain: Array<{
    statement: string;
    confidence: number;
    source_title: string;
    source_url: string;
    published_at: string;
  }>;
  remaining_uncertainties: string[];
  recommended_strategic_actions: string[];
  is_pinned?: boolean;
  is_acknowledged?: boolean;
  tags: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  description: string;
  sector?: string;
  centrality: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  is_active: boolean;
  valid_since: string;
  valid_until?: string | null;
  confidence: number;
}

export interface GraphTopology {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface EvidenceCitation {
  citation_id: string;
  source_title: string;
  source_url: string;
  published_date: string;
  excerpt: string;
  reliability_weight: number;
  entity_references: string[];
}

export interface ContradictionReport {
  has_conflicts: boolean;
  topic: string;
  claim_a?: string;
  source_a?: string;
  claim_b?: string;
  source_b?: string;
  analysis: string;
}

export interface GroundedSynthesisReport {
  query: string;
  selected_strategy: RetrievalStrategy;
  strategy_rationale: string;
  direct_answer: string;
  synthesis_markdown: string;
  executive_takeaways: string[];
  citations: EvidenceCitation[];
  subgraph_nodes: any[];
  subgraph_edges: any[];
  temporal_anchor?: string | null;
  contradictions?: ContradictionReport | null;
  confidence_score: number;
  latency_ms: number;
}

export interface CompetitorCompany {
  id: string;
  name: string;
  domain_sector: string;
  centrality_score: number;
  flagship_products: string[];
  key_partners: string[];
  direct_competitors: string[];
  headquarters: string;
  market_tier: string;
}
