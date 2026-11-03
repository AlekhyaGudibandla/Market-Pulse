import logging
from datetime import datetime, timedelta
from app.pipeline.graph.graph_service import graph_service
from app.pipeline.resolution.canonical_registry import CANONICAL_ENTITIES
from app.models.relationship import TemporalRelationship, RelationType, EvidenceLink
from app.rag.vector_store import vector_store

logger = logging.getLogger("marketpulse.seed")


def seed_knowledge_base():
    """
    Seeds the Temporal Knowledge Graph and Vector Index with foundational
    AI Infrastructure entities, active partnerships, and patent filings.
    """
    logger.info("Initializing MarketPulse Knowledge Graph & Vector Store with AI Infrastructure baseline...")

    # 1. Upsert Canonical Entities
    for entity in CANONICAL_ENTITIES.values():
        graph_service.upsert_entity(entity)

    # 2. Add Foundational Temporal Relationships
    base_date_2023 = datetime(2023, 1, 15)
    base_date_2024 = datetime(2024, 3, 18)

    seed_relationships = [
        # NVIDIA <-> TSMC
        TemporalRelationship(
            id="rel_nvidia_tsmc_cowos",
            source_id="company_nvidia",
            target_id="company_tsmc",
            relation_type=RelationType.SUPPLIES_TO,
            valid_since=base_date_2023,
            valid_until=None,
            is_active=True,
            confidence=1.0,
            evidence_chain=[
                EvidenceLink(
                    event_id="evt_seed_01",
                    source_url="https://sec.gov/edgar/nvda-10k",
                    snippet="NVIDIA contracts TSMC for primary advanced wafer fabrication and CoWoS 2.5D packaging.",
                    timestamp=base_date_2023
                )
            ]
        ),
        # NVIDIA released B200
        TemporalRelationship(
            id="rel_nvidia_released_b200",
            source_id="company_nvidia",
            target_id="product_b200",
            relation_type=RelationType.RELEASED,
            valid_since=base_date_2024,
            is_active=True,
            confidence=1.0
        ),
        # Cerebras released WSE-3
        TemporalRelationship(
            id="rel_cerebras_released_wse3",
            source_id="company_cerebras",
            target_id="product_wse3",
            relation_type=RelationType.RELEASED,
            valid_since=base_date_2024,
            is_active=True,
            confidence=1.0
        ),
        # Groq released LPU
        TemporalRelationship(
            id="rel_groq_released_lpu",
            source_id="company_groq",
            target_id="product_groq_lpu",
            relation_type=RelationType.RELEASED,
            valid_since=datetime(2023, 9, 1),
            is_active=True,
            confidence=1.0
        ),
        # AMD released MI300X
        TemporalRelationship(
            id="rel_amd_released_mi300x",
            source_id="company_amd",
            target_id="product_mi300x",
            relation_type=RelationType.RELEASED,
            valid_since=datetime(2023, 12, 6),
            is_active=True,
            confidence=1.0
        ),
        # Direct Competition
        TemporalRelationship(
            id="rel_comp_nvidia_amd",
            source_id="company_nvidia",
            target_id="company_amd",
            relation_type=RelationType.COMPETES_WITH,
            valid_since=datetime(2020, 1, 1),
            is_active=True,
            confidence=1.0
        ),
        TemporalRelationship(
            id="rel_comp_nvidia_cerebras",
            source_id="company_nvidia",
            target_id="company_cerebras",
            relation_type=RelationType.COMPETES_WITH,
            valid_since=datetime(2021, 6, 1),
            is_active=True,
            confidence=0.95
        ),
        TemporalRelationship(
            id="rel_comp_nvidia_groq",
            source_id="company_nvidia",
            target_id="company_groq",
            relation_type=RelationType.COMPETES_WITH,
            valid_since=datetime(2023, 10, 1),
            is_active=True,
            confidence=0.95
        ),
        TemporalRelationship(
            id="rel_comp_openai_anthropic",
            source_id="company_openai",
            target_id="company_anthropic",
            relation_type=RelationType.COMPETES_WITH,
            valid_since=datetime(2021, 5, 1),
            is_active=True,
            confidence=1.0
        ),
        # Partnerships
        TemporalRelationship(
            id="rel_part_openai_microsoft",
            source_id="company_openai",
            target_id="company_microsoft",
            relation_type=RelationType.PARTNERED_WITH,
            valid_since=datetime(2019, 7, 22),
            is_active=True,
            confidence=1.0
        ),
        TemporalRelationship(
            id="rel_part_cerebras_tsmc",
            source_id="company_cerebras",
            target_id="company_tsmc",
            relation_type=RelationType.SUPPLIES_TO,
            valid_since=datetime(2022, 1, 1),
            is_active=True,
            confidence=0.98
        )
    ]

    for rel in seed_relationships:
        graph_service.add_relationship(rel)

    # 3. Seed Vector Store with High-Value Technical Intelligence Documents
    seed_docs = [
        {
            "id": "doc_tsmc_cowos_capacity",
            "title": "TSMC 2.5D/3D Packaging Roadmap & CoWoS Bottlenecks",
            "url": "https://marketpulse.ai/analysis/tsmc-cowos-2024",
            "published_at": "2024-04-12",
            "entities": ["company_tsmc", "tech_cowos", "company_nvidia", "company_amd"],
            "event_type": "SUPPLY_CHAIN_SHIFT",
            "text": (
                "TSMC continues aggressive expansion of its CoWoS (Chip-on-Wafer-on-Substrate) packaging capacity in Taichung and Chiayi. "
                "While monthly wafer output is planned to scale towards 45,000 wafers by late 2024, NVIDIA and AMD retain "
                "over 75% of total dedicated allocations for Blackwell B200 and MI300X accelerators. "
                "Startups seeking 2.5D packaging face 9-month allocation backlogs."
            )
        },
        {
            "id": "doc_cerebras_wse3_launch",
            "title": "Cerebras Announces CS-3 AI Supercomputer with 4 Trillion Transistor Wafer",
            "url": "https://cerebras.ai/press/cs3-announcement",
            "published_at": "2024-03-13",
            "entities": ["company_cerebras", "product_wse3", "company_tsmc"],
            "event_type": "CHIP_ANNOUNCEMENT",
            "text": (
                "Cerebras Systems unveiled the Wafer Scale Engine 3 (WSE-3), fabricating a monolithic 4-trillion-transistor wafer "
                "on TSMC's 5nm process node. Packing 900,000 AI cores and 44 Gigabytes of on-chip SRAM, CS-3 delivers up to 125 Petaflops "
                "of peak AI compute. Cerebras claims 10x compute density compared to standard GPU clusters by eliminating off-chip network hops."
            )
        },
        {
            "id": "doc_groq_lpu_inference",
            "title": "Groq Demonstrates 500 Tokens/Sec on Llama-3 with Deterministic LPU Architecture",
            "url": "https://groq.com/news/llama3-inference-benchmark",
            "published_at": "2024-05-20",
            "entities": ["company_groq", "product_groq_lpu", "tech_sram_inference"],
            "event_type": "BENCHMARK_CLAIM",
            "text": (
                "Groq demonstrated ultra-low latency language model generation exceeding 500 tokens per second for Llama-3 8B. "
                "By replacing conventional high-bandwidth memory (HBM) with 230MB of on-chip SRAM per chip and using a software-scheduled "
                "compiler rather than dynamic hardware branch prediction, Groq achieves instantaneous first-token and inter-token latency."
            )
        },
        {
            "id": "doc_nvidia_blackwell_launch",
            "title": "NVIDIA Keynote: Blackwell B200 Architecture and GB200 NVL72 Rack Scale",
            "url": "https://nvidianews.nvidia.com/news/blackwell-architecture-arrival",
            "published_at": "2024-03-18",
            "entities": ["company_nvidia", "product_b200", "company_tsmc"],
            "event_type": "CHIP_ANNOUNCEMENT",
            "text": (
                "NVIDIA founder and CEO Jensen Huang unveiled the Blackwell architecture at GTC 2024. Featuring 208 billion transistors "
                "manufactured using custom two-reticle limit TSMC 4NP process joined by a 10 TB/s chip-to-chip interconnect. "
                "GB200 NVL72 connects 36 Grace CPUs and 72 Blackwell GPUs in a single liquid-cooled rack acting as one giant unified GPU."
            )
        },
        {
            "id": "doc_openai_custom_silicon",
            "title": "OpenAI Explores Dedicated In-House Inference Silicon with Broadcom & TSMC",
            "url": "https://reuters.com/tech/openai-custom-chip-broadcom-tsmc",
            "published_at": "2024-10-29",
            "entities": ["company_openai", "company_tsmc", "company_microsoft"],
            "event_type": "PARTNERSHIP",
            "text": (
                "OpenAI has initiated strategic development of in-house artificial intelligence silicon focused on inference workloads. "
                "The venture involves design partnership with Broadcom and manufacturing capacity reserved at TSMC. "
                "The move aims to diversify infrastructure beyond pure dependence on NVIDIA GPUs as inference volume surges."
            )
        }
    ]

    for doc in seed_docs:
        vector_store.add_document(
            doc_id=doc["id"],
            text=doc["text"],
            metadata={
                "title": doc["title"],
                "url": doc["url"],
                "published_at": doc["published_at"],
                "entities": doc["entities"],
                "event_type": doc["event_type"]
            }
        )

    logger.info("MarketPulse knowledge base seed completed successfully.")


# Execute seed
seed_knowledge_base()
