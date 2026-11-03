import { IntelligenceAlert, GraphTopology, CompetitorCompany, GroundedSynthesisReport } from "./types";

export const MOCK_ALERTS: IntelligenceAlert[] = [
  {
    id: "alert_cerebras_cs3",
    event_id: "evt_cs3_01",
    event_title: "Cerebras Unveils CS-3 Wafer Scale AI System with 900,000 Cores on TSMC 5nm",
    timestamp: "2024-03-13T10:00:00Z",
    what_changed: "Cerebras Systems officially revealed the CS-3 AI supercomputer with 4 trillion transistors on TSMC 5nm, achieving 125 PFLOPS FP16 compute and 44GB on-chip SRAM.",
    why_it_matters: "Bypasses external DRAM memory bandwidth bottlenecks by keeping all model parameters and intermediate activations on-die. Directly threatens NVIDIA H100 and B200 clusters in compute density and batch-1 interactive inference latency.",
    historical_context: "Historically, Cerebras established wafer-scale fabrication with TSMC (2022). The CS-3 represents their 3rd generation system, doubling transistor count over the WSE-2.",
    novelty: {
      overall_novelty: 0.94,
      semantic_distance: 0.88,
      graph_topology_delta: 0.95,
      is_repeat: false,
      reasoning: "Genuinely novel silicon release; first commercial 4-trillion transistor monolithic wafer fabricated on TSMC 5nm."
    },
    impact: {
      overall_impact: 0.88,
      centrality_shift: 0.09,
      affected_competitors_count: 3,
      severity: "CRITICAL",
      market_disruption_potential: "Transformative",
      rationale: "Exerts direct architectural pressure on NVIDIA and AMD datacenter scale-up systems for frontier model training."
    },
    primary_entity_id: "company_cerebras",
    primary_entity_name: "Cerebras Systems",
    affected_competitors: [
      {
        competitor_id: "company_nvidia",
        competitor_name: "NVIDIA Corporation",
        threat_level: "CRITICAL",
        overlap_area: "AI Hardware & Systems",
        why_affected: "Direct challenge to multi-GPU HGX clusters. WSE-3 eliminates optical retimers and InfiniBand switch hops.",
        graph_distance: 1
      },
      {
        competitor_id: "company_amd",
        competitor_name: "Advanced Micro Devices",
        threat_level: "HIGH",
        overlap_area: "AI Hardware & Systems",
        why_affected: "Competes for tier-1 national laboratory and sovereign AI cloud compute cluster allocations.",
        graph_distance: 1
      }
    ],
    affected_technologies: ["Wafer-Scale Integration", "On-Chip SRAM Memory Architecture", "CoWoS Packaging"],
    evidence_chain: [
      {
        statement: "Cerebras packs 900,000 AI cores and 44GB of on-chip SRAM into a single monolithic wafer.",
        confidence: 0.98,
        source_title: "Cerebras CS-3 Launch Disclosures",
        source_url: "https://cerebras.ai/press/cs3-announcement-2024",
        published_at: "2024-03-13"
      }
    ],
    remaining_uncertainties: [
      "Commercial wafer yield rates and defect redundancy overhead per wafer.",
      "Firm delivery schedules for cloud hyperscalers outside of G42 sovereign cluster deployments."
    ],
    recommended_strategic_actions: [
      "Benchmark LLM fine-tuning latency per token against NVIDIA HGX H100 baselines.",
      "Monitor hyperscaler API adoption of Cerebras Inference Cloud."
    ],
    tags: ["CHIP_ANNOUNCEMENT", "Cerebras Systems", "CRITICAL"]
  },
  {
    id: "alert_groq_aramco",
    event_id: "evt_groq_02",
    event_title: "Groq Secures Multi-Megawatt Datacenter Deployment with Aramco Digital for Ultra-Low Latency Inference",
    timestamp: "2024-05-20T14:30:00Z",
    what_changed: "Groq signed an exclusive multi-megawatt datacenter deployment deal with Aramco Digital to roll out LPU tensor streaming chips across regional datacenters.",
    why_it_matters: "Demonstrates large-scale sovereign enterprise backing for non-GPU inference architectures. Guarantees long-term wafer purchase volume and validation for LPU determinism.",
    historical_context: "Groq previously raised $300M+ to challenge NVIDIA in pure inference token generation. This contract represents their largest commercial sovereign deployment to date.",
    novelty: {
      overall_novelty: 0.89,
      semantic_distance: 0.85,
      graph_topology_delta: 0.90,
      is_repeat: false,
      reasoning: "First commercial multi-megawatt datacenter deployment for Language Processing Units (LPUs)."
    },
    impact: {
      overall_impact: 0.82,
      centrality_shift: 0.08,
      affected_competitors_count: 2,
      severity: "HIGH",
      market_disruption_potential: "High Disruption",
      rationale: "Captures lucrative Middle Eastern sovereign cloud compute budget away from traditional GPU vendors."
    },
    primary_entity_id: "company_groq",
    primary_entity_name: "Groq Inc.",
    affected_competitors: [
      {
        competitor_id: "company_nvidia",
        competitor_name: "NVIDIA Corporation",
        threat_level: "HIGH",
        overlap_area: "AI Inference Accelerators",
        why_affected: "Direct margin pressure on NVIDIA H100 NVL inference deployments.",
        graph_distance: 1
      }
    ],
    affected_technologies: ["AI Inference Accelerators", "On-Chip SRAM Memory Architecture"],
    evidence_chain: [
      {
        statement: "Aramco Digital contracts Groq to power high-throughput regional AI inference nodes.",
        confidence: 0.95,
        source_title: "Reuters Middle East Technology News",
        source_url: "https://reuters.com/tech/groq-aramco-datacenter-partnership",
        published_at: "2024-05-20"
      }
    ],
    remaining_uncertainties: [
      "Power efficiency (TDP) under non-autoregressive multimodal vision workloads.",
      "Software support timeline for MoE architectures exceeding 100B parameters."
    ],
    recommended_strategic_actions: [
      "Evaluate GroqCloud API pricing for time-sensitive customer support bot pipelines."
    ],
    tags: ["PARTNERSHIP", "Groq Inc.", "HIGH"]
  },
  {
    id: "alert_nvidia_b300",
    event_id: "evt_nvda_03",
    event_title: "NVIDIA Keynote: Blackwell Ultra B300 With 288GB HBM3e Memory and 5th Gen NVLink Announced",
    timestamp: "2024-06-02T09:00:00Z",
    what_changed: "NVIDIA announced the Blackwell Ultra B300 accelerator, expanding onboard HBM3e memory to 288GB with 8.0 TB/s bandwidth.",
    why_it_matters: "Re-asserts NVIDIA's lead in serving massive frontier Mixture-of-Experts (MoE) models on fewer physical servers, countering AMD MI325X memory capacity claims.",
    historical_context: "NVIDIA previously unveiled the B200 in March 2024 with 192GB memory. The B300 upgrade is an accelerated response to AMD's memory capacity push.",
    novelty: {
      overall_novelty: 0.72,
      semantic_distance: 0.65,
      graph_topology_delta: 0.75,
      is_repeat: false,
      reasoning: "Architectural revision of Blackwell with 50% memory expansion."
    },
    impact: {
      overall_impact: 0.91,
      centrality_shift: 0.12,
      affected_competitors_count: 3,
      severity: "CRITICAL",
      market_disruption_potential: "Transformative",
      rationale: "Forces AMD and custom ASIC builders to accelerate memory roadmaps to stay competitive."
    },
    primary_entity_id: "company_nvidia",
    primary_entity_name: "NVIDIA Corporation",
    affected_competitors: [
      {
        competitor_id: "company_amd",
        competitor_name: "Advanced Micro Devices",
        threat_level: "CRITICAL",
        overlap_area: "AI Hardware & Systems",
        why_affected: "Neutralizes AMD MI300X's memory capacity marketing advantage.",
        graph_distance: 1
      }
    ],
    affected_technologies: ["CoWoS Packaging", "HBM3e Memory", "5th Gen NVLink"],
    evidence_chain: [
      {
        statement: "Blackwell Ultra B300 packs 288GB of HBM3e delivering 8 TB/s memory bandwidth.",
        confidence: 0.99,
        source_title: "NVIDIA Official Investor Disclosures",
        source_url: "https://nvidianews.nvidia.com/news/blackwell-ultra-b300",
        published_at: "2024-06-02"
      }
    ],
    remaining_uncertainties: [
      "TSMC CoWoS-L packaging volume yield stabilization.",
      "Liquid cooling datacenter retrofit requirements for hyperscalers."
    ],
    recommended_strategic_actions: [
      "Review datacenter power and liquid cooling readiness for 120kW NVL72 rack specifications."
    ],
    tags: ["CHIP_ANNOUNCEMENT", "NVIDIA Corporation", "CRITICAL"]
  }
];

export const MOCK_GRAPH: GraphTopology = {
  nodes: [
    { id: "company_nvidia", label: "NVIDIA Corporation", type: "COMPANY", description: "Market leader in AI training GPUs & CUDA", sector: "AI Hardware & Systems", centrality: 0.45 },
    { id: "company_tsmc", label: "TSMC", type: "COMPANY", description: "Foundry leader in 3nm silicon & CoWoS packaging", sector: "Semiconductor Manufacturing", centrality: 0.40 },
    { id: "company_cerebras", label: "Cerebras Systems", type: "COMPANY", description: "Creator of the Wafer Scale Engine CS-3", sector: "AI Hardware & Systems", centrality: 0.28 },
    { id: "company_groq", label: "Groq Inc.", type: "COMPANY", description: "LPU tensor streaming chip for instant inference", sector: "AI Inference Accelerators", centrality: 0.25 },
    { id: "company_amd", label: "Advanced Micro Devices", type: "COMPANY", description: "Instinct MI300X & MI325X accelerator designer", sector: "AI Hardware & Systems", centrality: 0.35 },
    { id: "company_openai", label: "OpenAI", type: "COMPANY", description: "Frontier model lab behind GPT-4o & o1", sector: "Frontier AI Models", centrality: 0.38 },
    { id: "company_microsoft", label: "Microsoft", type: "COMPANY", description: "Azure Cloud & Maia custom AI silicon", sector: "Cloud Hyperscaler", centrality: 0.42 },
    { id: "company_anthropic", label: "Anthropic", type: "COMPANY", description: "Frontier AI safety lab behind Claude 3.5 Sonnet", sector: "Frontier AI Models", centrality: 0.30 },
    { id: "company_cursor", label: "Anysphere (Cursor)", type: "COMPANY", description: "AI-first agentic code editor and platform", sector: "AI Developer Tools", centrality: 0.22 },
    { id: "product_b200", label: "Blackwell B200 / B300", type: "PRODUCT", description: "Dual-die 208B transistor GPU", sector: "AI Hardware", centrality: 0.20 },
    { id: "product_wse3", label: "Cerebras WSE-3", type: "PRODUCT", description: "4-trillion transistor wafer-scale chip", sector: "AI Hardware", centrality: 0.18 },
    { id: "product_groq_lpu", label: "Groq LPU", type: "PRODUCT", description: "Language Processing Unit with on-chip SRAM", sector: "AI Hardware", centrality: 0.16 },
    { id: "tech_cowos", label: "CoWoS Packaging", type: "TECHNOLOGY", description: "TSMC 2.5D wafer substrate bonding", sector: "Semiconductor Tech", centrality: 0.32 }
  ],
  edges: [
    { id: "e1", from: "company_nvidia", to: "company_tsmc", label: "SUPPLIES_TO", is_active: true, valid_since: "2023-01-15T00:00:00Z", confidence: 1.0 },
    { id: "e2", from: "company_nvidia", to: "product_b200", label: "RELEASED", is_active: true, valid_since: "2024-03-18T00:00:00Z", confidence: 1.0 },
    { id: "e3", from: "company_cerebras", to: "company_tsmc", label: "SUPPLIES_TO", is_active: true, valid_since: "2022-01-01T00:00:00Z", confidence: 0.98 },
    { id: "e4", from: "company_cerebras", to: "product_wse3", label: "RELEASED", is_active: true, valid_since: "2024-03-13T00:00:00Z", confidence: 1.0 },
    { id: "e5", from: "company_groq", to: "product_groq_lpu", label: "RELEASED", is_active: true, valid_since: "2023-09-01T00:00:00Z", confidence: 1.0 },
    { id: "e6", from: "company_nvidia", to: "company_amd", label: "COMPETES_WITH", is_active: true, valid_since: "2020-01-01T00:00:00Z", confidence: 1.0 },
    { id: "e7", from: "company_nvidia", to: "company_cerebras", label: "COMPETES_WITH", is_active: true, valid_since: "2021-06-01T00:00:00Z", confidence: 0.95 },
    { id: "e8", from: "company_nvidia", to: "company_groq", label: "COMPETES_WITH", is_active: true, valid_since: "2023-10-01T00:00:00Z", confidence: 0.95 },
    { id: "e9", from: "company_openai", to: "company_microsoft", label: "PARTNERED_WITH", is_active: true, valid_since: "2019-07-22T00:00:00Z", confidence: 1.0 },
    { id: "e10", from: "company_openai", to: "company_anthropic", label: "COMPETES_WITH", is_active: true, valid_since: "2021-05-01T00:00:00Z", confidence: 1.0 },
    { id: "e11", from: "company_tsmc", to: "tech_cowos", label: "USES", is_active: true, valid_since: "2020-01-01T00:00:00Z", confidence: 1.0 }
  ]
};

export const MOCK_COMPANIES: CompetitorCompany[] = [
  {
    id: "company_nvidia",
    name: "NVIDIA Corporation",
    domain_sector: "AI Hardware & Systems",
    centrality_score: 0.45,
    flagship_products: ["Blackwell B200 / B300", "Hopper H100", "GB200 NVL72"],
    key_partners: ["TSMC", "Microsoft Azure", "AWS", "Google Cloud"],
    direct_competitors: ["AMD", "Cerebras Systems", "Groq Inc."],
    headquarters: "Santa Clara, CA",
    market_tier: "Megacap ($3T+)"
  },
  {
    id: "company_cerebras",
    name: "Cerebras Systems",
    domain_sector: "AI Hardware & Systems",
    centrality_score: 0.28,
    flagship_products: ["CS-3 Wafer Scale Engine", "Cerebras Inference Cloud"],
    key_partners: ["TSMC", "G42"],
    direct_competitors: ["NVIDIA", "AMD"],
    headquarters: "Sunnyvale, CA",
    market_tier: "Late Stage ($8B+ Pre-IPO)"
  },
  {
    id: "company_groq",
    name: "Groq Inc.",
    domain_sector: "AI Inference Accelerators",
    centrality_score: 0.25,
    flagship_products: ["Groq LPU Chip", "GroqCloud API"],
    key_partners: ["Aramco Digital", "Defiance Capital"],
    direct_competitors: ["NVIDIA", "Cerebras Systems"],
    headquarters: "Mountain View, CA",
    market_tier: "Late Stage ($2.8B+)"
  },
  {
    id: "company_amd",
    name: "Advanced Micro Devices",
    domain_sector: "AI Hardware & Systems",
    centrality_score: 0.35,
    flagship_products: ["Instinct MI300X", "Instinct MI325X"],
    key_partners: ["TSMC", "Microsoft", "Meta"],
    direct_competitors: ["NVIDIA", "Intel"],
    headquarters: "Santa Clara, CA",
    market_tier: "Large Cap ($250B+)"
  },
  {
    id: "company_cursor",
    name: "Anysphere (Cursor)",
    domain_sector: "AI Developer Tools",
    centrality_score: 0.22,
    flagship_products: ["Cursor IDE", "Agentic Speculative Autocomplete"],
    key_partners: ["OpenAI", "Anthropic"],
    direct_competitors: ["Microsoft GitHub Copilot", "Cognition Devin"],
    headquarters: "San Francisco, CA",
    market_tier: "Unicorn ($400M+)"
  }
];
