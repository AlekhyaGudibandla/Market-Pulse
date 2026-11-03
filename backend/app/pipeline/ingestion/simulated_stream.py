import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.event import RawEvent, EventSource, EventType
from app.models.alert import IntelligenceAlert
from app.streaming.idempotency import idempotency_manager
from app.streaming.kafka_producer import producer
from app.pipeline.extraction.extractor import extractor
from app.pipeline.change_detection.novelty_scorer import novelty_scorer
from app.pipeline.change_detection.impact_analyzer import impact_analyzer
from app.pipeline.change_detection.alert_generator import alert_generator
from app.rag.vector_store import vector_store

logger = logging.getLogger("marketpulse.simulator")

# Global alerts repository for API retrieval
ALERTS_REPOSITORY: List[IntelligenceAlert] = []
RAW_EVENTS_REPOSITORY: List[RawEvent] = []


SIMULATED_SCENARIOS = [
    {
        "title": "Cerebras Unveils CS-3 Wafer Scale AI System with 900,000 Cores on TSMC 5nm",
        "content": (
            "Cerebras Systems officially launched the CS-3 AI supercomputer today, built around the Wafer Scale Engine 3. "
            "Fabricated exclusively by TSMC on a 5nm process node, the monolithic wafer packs 4 trillion transistors, "
            "900,000 AI optimized cores, and 44GB of on-chip SRAM. Cerebras claims the CS-3 delivers up to 125 Petaflops "
            "of FP16 AI performance, outperforming traditional NVIDIA H100 clusters in compute density by 8x for frontier LLM pre-training."
        ),
        "source": EventSource.COMPANY_BLOG,
        "source_url": "https://cerebras.ai/press/cs3-announcement-2024",
        "publisher": "Cerebras Communications"
    },
    {
        "title": "Groq Secures Multi-Megawatt Datacenter Deployment with Aramco Digital for Ultra-Low Latency Inference",
        "content": (
            "Groq announced a major commercial partnership with Aramco Digital to establish high-throughput inference datacenters "
            "across the Middle East. Groq's Language Processing Unit (LPU) chips will power real-time AI enterprise workloads, "
            "delivering over 400 tokens per second on open-weights models like Llama-3. The deal directly challenges NVIDIA's regional GPU datacenter dominance."
        ),
        "source": EventSource.TECH_NEWS,
        "source_url": "https://reuters.com/tech/groq-aramco-datacenter-partnership",
        "publisher": "Reuters"
    },
    {
        "title": "NVIDIA Keynote: Blackwell Ultra B300 With 288GB HBM3e Memory and 5th Gen NVLink Announced",
        "content": (
            "At an investor briefing, NVIDIA revealed the Blackwell Ultra B300 accelerator. Featuring expanded 288GB HBM3e memory "
            "and TSMC CoWoS advanced packaging, the chip offers a 50% memory bandwidth expansion over earlier B200 iterations. "
            "Jensen Huang emphasized that full rackscale GB200 NVL72 shipments will begin scaling in Q1, solidifying NVIDIA's hold on hyperscaler training clusters."
        ),
        "source": EventSource.COMPANY_BLOG,
        "source_url": "https://nvidianews.nvidia.com/news/blackwell-ultra-b300",
        "publisher": "NVIDIA Press Office"
    },
    {
        "title": "OpenAI and Broadcom Form Strategic Alliance with TSMC for Custom Inference ASIC Silicon",
        "content": (
            "OpenAI has finalized agreements with Broadcom and TSMC to design and fabricate a specialized application-specific "
            "integrated circuit (ASIC) engineered specifically for ChatGPT and o1 inference serving. The chips, slated for initial tape-out "
            "in 2025, are designed to drastically lower OpenAI's operational inference expenditure and reduce sole dependency on NVIDIA GPUs."
        ),
        "source": EventSource.TECH_NEWS,
        "source_url": "https://theinformation.com/articles/openai-broadcom-tsmc-custom-chip",
        "publisher": "The Information"
    },
    {
        "title": "US Patent Office Publishes NVIDIA Patent for Direct Multi-Die Optical Interconnect Waveguides",
        "content": (
            "The USPTO published US Patent 11,894,302 assigned to NVIDIA Corporation. The patent describes optical wave-guides "
            "integrated directly into wafer substrates, eliminating copper copper-traces and electrical retimers to slash chip-to-chip latency "
            "by 90% across distributed GPU clusters. This patent protects critical physical architecture against rivals AMD and Tenstorrent."
        ),
        "source": EventSource.PATENT_OFFICE,
        "source_url": "https://patents.google.com/patent/US11894302B2",
        "publisher": "USPTO"
    },
    {
        "title": "Cursor Creator Anysphere Closes $60M Funding Led by Andreessen Horowitz as Agentic IDE Adoption Explodes",
        "content": (
            "Anysphere, the developer of the popular AI-native code editor Cursor, has raised $60 million in Series A funding. "
            "Cursor's speculative multi-token autocomplete and repository-wide context engine have captured significant market share "
            "from Microsoft's GitHub Copilot. The company plans to expand custom models tailored for agentic software engineering."
        ),
        "source": EventSource.TECH_NEWS,
        "source_url": "https://techcrunch.com/2024/08/22/anysphere-cursor-funding-a16z",
        "publisher": "TechCrunch"
    },
    {
        "title": "AMD Unveils Instinct MI325X GPU Featuring 256GB HBM3e Memory to Challenge NVIDIA Blackwell",
        "content": (
            "AMD CEO Lisa Su unveiled the Instinct MI325X generative AI accelerator at Computex. Offering 256GB of high-bandwidth memory "
            "and 6.0 TB/s bandwidth manufactured on TSMC's advanced packaging lines, the MI325X matches or exceeds NVIDIA B200 memory capacity, "
            "directly targeting LLM serving clusters that are constrained by memory footprint."
        ),
        "source": EventSource.TECH_NEWS,
        "source_url": "https://anandtech.com/show/amd-instinct-mi325x-announced",
        "publisher": "AnandTech"
    }
]


class IngestionPipelineService:
    """
    End-to-end continuous ingestion and intelligence processing coordinator.
    """
    async def process_raw_event(self, raw: RawEvent) -> Optional[IntelligenceAlert]:
        RAW_EVENTS_REPOSITORY.append(raw)
        
        # 1. Publish to Kafka raw topic
        await producer.send_raw_event(raw.model_dump())

        # 2. Check Idempotency / Deduplication
        if not idempotency_manager.check_and_reserve(raw.id, raw.content_hash):
            logger.info(f"Idempotency filter suppressed duplicate event: {raw.id} ({raw.title})")
            return None

        # 3. Extraction Stage (Entities, Relationships, Claims)
        norm_event = extractor.extract_from_raw_event(raw)
        await producer.send_parsed_event(norm_event.model_dump())

        # 4. Novelty Scoring
        novelty = novelty_scorer.evaluate_novelty(norm_event)
        norm_event.novelty_score = novelty.overall_novelty
        norm_event.is_genuine_novelty = not novelty.is_repeat

        # 5. Impact Analysis & Competitor Ripple Traversal
        impact, affected_competitors, primary_entity_id = impact_analyzer.analyze_impact(norm_event)
        norm_event.impact_score = impact.overall_impact

        # 6. Traceable Alert Generation
        alert = alert_generator.generate_alert(
            event=norm_event,
            novelty=novelty,
            impact=impact,
            affected_competitors=affected_competitors,
            primary_entity_id=primary_entity_id
        )

        # 7. Publish Alert to Kafka
        await producer.send_alert(alert.model_dump())

        # 8. Store in Alerts Repository
        ALERTS_REPOSITORY.insert(0, alert)

        # 9. Commit Idempotency record
        idempotency_manager.commit(raw.id)

        # 10. Index in Vector Store for RAG retrieval
        vector_store.add_document(
            doc_id=norm_event.id,
            text=f"{raw.title}. {raw.content}. What changed: {alert.what_changed}. Why it matters: {alert.why_it_matters}",
            metadata={
                "title": raw.title,
                "url": raw.source_url,
                "published_at": raw.timestamp.strftime("%Y-%m-%d"),
                "entities": norm_event.extracted_entities,
                "event_type": norm_event.event_type.value,
                "alert_id": alert.id
            }
        )

        logger.info(f"Intelligence alert generated: [{alert.impact.severity.value}] {alert.event_title}")
        return alert

    async def run_simulation_cycle(self, index: int = 0) -> Optional[IntelligenceAlert]:
        scenario = SIMULATED_SCENARIOS[index % len(SIMULATED_SCENARIOS)]
        event_id = f"evt_sim_{uuid.uuid4().hex[:8]}"
        fingerprint = idempotency_manager.compute_fingerprint(
            source=scenario["source"].value,
            source_url=scenario["source_url"],
            title=scenario["title"],
            content=scenario["content"]
        )

        raw = RawEvent(
            id=event_id,
            title=scenario["title"],
            content=scenario["content"],
            source=scenario["source"],
            source_url=scenario["source_url"],
            author_or_publisher=scenario["publisher"],
            timestamp=datetime.utcnow(),
            content_hash=fingerprint
        )

        return await self.process_raw_event(raw)

    async def bootstrap_initial_events(self):
        """Pre-populates the alerts feed with initial rich scenarios."""
        if not ALERTS_REPOSITORY:
            logger.info("Bootstrapping MarketPulse initial intelligence alerts feed...")
            for i in range(len(SIMULATED_SCENARIOS)):
                await self.run_simulation_cycle(i)


pipeline_service = IngestionPipelineService()
