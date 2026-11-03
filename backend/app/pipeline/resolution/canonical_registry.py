from typing import Dict, List, Optional
from app.models.entity import Entity, EntityType

CANONICAL_ENTITIES: Dict[str, Entity] = {
    # Companies
    "company_nvidia": Entity(
        id="company_nvidia",
        name="NVIDIA Corporation",
        entity_type=EntityType.COMPANY,
        aliases=["NVIDIA", "Nvidia", "NVDA", "Nvidia Corp", "NVIDIA Corp.", "Team Green"],
        description="Global market leader in AI training GPUs, CUDA software stack, and datacenter networking systems.",
        domain_sector="AI Hardware & Systems",
        founded_or_created="1993",
        headquarters="Santa Clara, CA",
        market_cap_tier="Megacap",
        metadata={"ticker": "NVDA", "primary_foundry": "company_tsmc"}
    ),
    "company_tsmc": Entity(
        id="company_tsmc",
        name="Taiwan Semiconductor Manufacturing Company",
        entity_type=EntityType.COMPANY,
        aliases=["TSMC", "Taiwan Semi", "TSMC Ltd", "TSMC 2330", "Taiwan Semiconductor"],
        description="The world's preeminent dedicated semiconductor foundry, fabricating leading-edge 3nm/2nm chips and CoWoS advanced packaging.",
        domain_sector="Semiconductor Manufacturing & Packaging",
        founded_or_created="1987",
        headquarters="Hsinchu, Taiwan",
        market_cap_tier="Megacap",
        metadata={"ticker": "TSM", "packaging_tech": "CoWoS"}
    ),
    "company_openai": Entity(
        id="company_openai",
        name="OpenAI",
        entity_type=EntityType.COMPANY,
        aliases=["OpenAI Inc", "OpenAI LLC", "OpenAI Ireland", "OpenAI Global"],
        description="Pioneering artificial intelligence research and commercial deployment company, creators of GPT-4, o1, and ChatGPT.",
        domain_sector="Frontier AI Models & Applications",
        founded_or_created="2015",
        headquarters="San Francisco, CA",
        market_cap_tier="Unicorn / High-Growth",
        metadata={"key_investor": "company_microsoft"}
    ),
    "company_cerebras": Entity(
        id="company_cerebras",
        name="Cerebras Systems",
        entity_type=EntityType.COMPANY,
        aliases=["Cerebras", "Cerebras Systems Inc", "Cerebras AI"],
        description="Creator of the Wafer Scale Engine (WSE), specialized for lightning-fast AI training and ultra-low latency inference.",
        domain_sector="AI Hardware & Wafer-Scale Computing",
        founded_or_created="2016",
        headquarters="Sunnyvale, CA",
        market_cap_tier="Late Stage / Pre-IPO",
        metadata={"flagship_product": "product_wse3"}
    ),
    "company_groq": Entity(
        id="company_groq",
        name="Groq Inc.",
        entity_type=EntityType.COMPANY,
        aliases=["Groq", "Groq AI", "Groq Systems", "Groq Inc"],
        description="Developer of the Language Processing Unit (LPU) ASIC and deterministic tensor streaming architecture optimized for instant token generation.",
        domain_sector="AI Inference Accelerators",
        founded_or_created="2016",
        headquarters="Mountain View, CA",
        market_cap_tier="Late Stage",
        metadata={"architecture": "tech_lpu"}
    ),
    "company_anthropic": Entity(
        id="company_anthropic",
        name="Anthropic",
        entity_type=EntityType.COMPANY,
        aliases=["Anthropic PBC", "Anthropic AI", "Anthropic Research"],
        description="AI safety and frontier research lab, creators of the Claude family of frontier intelligence models.",
        domain_sector="Frontier AI Models & Safety",
        founded_or_created="2021",
        headquarters="San Francisco, CA",
        market_cap_tier="Unicorn / High-Growth",
        metadata={"cloud_partners": ["company_amazon", "company_google"]}
    ),
    "company_amd": Entity(
        id="company_amd",
        name="Advanced Micro Devices",
        entity_type=EntityType.COMPANY,
        aliases=["AMD", "Advanced Micro Devices Inc", "AMD Inc"],
        description="Major designer of high-performance GPUs (Instinct series) and x86 CPUs competing directly with NVIDIA in AI datacenter silicon.",
        domain_sector="AI Hardware & Systems",
        founded_or_created="1969",
        headquarters="Santa Clara, CA",
        market_cap_tier="Large Cap",
        metadata={"ticker": "AMD", "flagship_gpu": "product_mi300x"}
    ),
    "company_microsoft": Entity(
        id="company_microsoft",
        name="Microsoft Corporation",
        entity_type=EntityType.COMPANY,
        aliases=["Microsoft", "MSFT", "Azure", "Microsoft Azure"],
        description="Global tech titan driving Azure cloud infrastructure, Copilot integration, and Maia custom AI accelerator silicon.",
        domain_sector="Cloud Hyperscaler & AI Platforms",
        founded_or_created="1975",
        headquarters="Redmond, WA",
        market_cap_tier="Megacap",
        metadata={"custom_chip": "Maia 100"}
    ),
    "company_google": Entity(
        id="company_google",
        name="Alphabet / Google",
        entity_type=EntityType.COMPANY,
        aliases=["Google", "Alphabet", "Google DeepMind", "Google Cloud", "GCP"],
        description="Pioneer in transformer architectures, Gemini models, and 6 generations of custom Tensor Processing Units (TPUs).",
        domain_sector="Cloud Hyperscaler & AI Research",
        founded_or_created="1998",
        headquarters="Mountain View, CA",
        market_cap_tier="Megacap",
        metadata={"flagship_asic": "TPU v5p / TPU v6 Trillium"}
    ),
    "company_cursor": Entity(
        id="company_cursor",
        name="Anysphere (Cursor)",
        entity_type=EntityType.COMPANY,
        aliases=["Cursor", "Cursor AI", "Anysphere", "Anysphere Inc"],
        description="AI-first code editor and developer platform revolutionizing agentic software engineering and code intelligence.",
        domain_sector="AI Developer Tools & Agentic IDEs",
        founded_or_created="2022",
        headquarters="San Francisco, CA",
        market_cap_tier="Unicorn / High-Growth",
        metadata={"product": "Cursor IDE"}
    ),

    # Products & Hardware
    "product_b200": Entity(
        id="product_b200",
        name="NVIDIA Blackwell B200 / GB200",
        entity_type=EntityType.PRODUCT,
        aliases=["Blackwell", "B200", "GB200", "GB200 NVL72", "NVIDIA Blackwell", "Blackwell Ultra"],
        description="Dual-die GPU architecture delivering up to 20 PFLOPS FP4 compute with 5th Gen NVLink and liquid-cooled rackscale clusters.",
        domain_sector="AI Hardware",
        metadata={"maker": "company_nvidia", "fab": "company_tsmc"}
    ),
    "product_h100": Entity(
        id="product_h100",
        name="NVIDIA H100 / H200 Hopper",
        entity_type=EntityType.PRODUCT,
        aliases=["H100", "H200", "Hopper GPU", "NVIDIA Hopper"],
        description="Industry standard datacenter AI acceleration GPU utilizing HBM3/HBM3e memory and 4th Gen Tensor Cores.",
        domain_sector="AI Hardware",
        metadata={"maker": "company_nvidia"}
    ),
    "product_wse3": Entity(
        id="product_wse3",
        name="Cerebras WSE-3",
        entity_type=EntityType.PRODUCT,
        aliases=["WSE-3", "WSE3", "Wafer Scale Engine 3", "CS-3"],
        description="Monolithic 4-trillion-transistor wafer-scale engine containing 900,000 AI cores and 44GB on-chip SRAM for cluster-free execution.",
        domain_sector="AI Hardware",
        metadata={"maker": "company_cerebras", "fab": "company_tsmc"}
    ),
    "product_groq_lpu": Entity(
        id="product_groq_lpu",
        name="Groq LPU Inference Chip",
        entity_type=EntityType.PRODUCT,
        aliases=["Groq LPU", "GroqChip", "Language Processing Unit", "GroqCard"],
        description="Single-core deterministic tensor streaming processor designed specifically for predictable, ultra-fast LLM generation with on-chip SRAM.",
        domain_sector="AI Hardware",
        metadata={"maker": "company_groq"}
    ),
    "product_mi300x": Entity(
        id="product_mi300x",
        name="AMD Instinct MI300X / MI325X",
        entity_type=EntityType.PRODUCT,
        aliases=["MI300X", "MI300", "MI325X", "AMD Instinct MI300X", "CDNA 3"],
        description="High-capacity 192GB HBM3 generative AI accelerator built using 3.5D chiplet stacking competing directly with NVIDIA H100.",
        domain_sector="AI Hardware",
        metadata={"maker": "company_amd", "fab": "company_tsmc"}
    ),

    # Key Technologies
    "tech_cowos": Entity(
        id="tech_cowos",
        name="CoWoS (Chip-on-Wafer-on-Substrate)",
        entity_type=EntityType.TECHNOLOGY,
        aliases=["CoWoS", "CoWoS-S", "CoWoS-L", "Advanced 2.5D Packaging"],
        description="TSMC's proprietary high-density wafer packaging technology critical for bonding HBM stacks directly beside high-performance compute dies.",
        domain_sector="Semiconductor Technology",
        metadata={"owner": "company_tsmc"}
    ),
    "tech_sram_inference": Entity(
        id="tech_sram_inference",
        name="On-Chip SRAM Memory Architecture",
        entity_type=EntityType.TECHNOLOGY,
        aliases=["On-Chip SRAM", "Near-Compute Memory", "HBM-Free Architecture"],
        description="High-bandwidth on-die memory design eliminating external DRAM memory walls for ultra-fast token-per-second throughput in inference.",
        domain_sector="Computer Architecture"
    ),

    # Key Patents
    "patent_interconnect_2024": Entity(
        id="patent_interconnect_2024",
        name="US Patent 11,894,302: Low-Latency Direct Chip-to-Chip Optical Interconnect",
        entity_type=EntityType.PATENT,
        aliases=["US11894302", "Optical Interconnect Patent", "Direct Mesh Fabric Patent"],
        description="Patent covering direct optical waveguide interconnects bypassing electronic switches for 10x lower latency in distributed tensor training.",
        domain_sector="Intellectual Property",
        metadata={"inventor_company": "company_nvidia"}
    )
}
