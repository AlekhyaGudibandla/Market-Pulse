from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "MarketPulse"
    PROJECT_DESCRIPTION: str = "Continuous Competitive Intelligence & Change Impact Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # Graph Database
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "marketpulse_secret"
    USE_EMBEDDED_GRAPH: bool = True  # Resilient fallback to NetworkX Temporal Graph

    # Kafka & Streaming Backbone
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    KAFKA_RAW_TOPIC: str = "events.raw"
    KAFKA_PARSED_TOPIC: str = "events.parsed"
    KAFKA_MUTATIONS_TOPIC: str = "graph.mutations"
    KAFKA_ALERTS_TOPIC: str = "alerts.generated"
    KAFKA_DLQ_TOPIC: str = "events.dlq"
    USE_EMBEDDED_KAFKA: bool = True  # High-performance in-memory partitioned bus fallback

    # Transactional & Vector DB
    DATABASE_URL: str = "postgresql://marketpulse:marketpulse@localhost:5432/marketpulse_db"
    VECTOR_DIMENSION: int = 384
    VECTOR_STORE_PATH: str = "backend/data/vector_store.json"

    # Redis Cache
    REDIS_URL: str = "redis://localhost:6379/0"
    USE_EMBEDDED_CACHE: bool = True

    # Scoring & Thresholds
    NOVELTY_THRESHOLD_ALERT: float = 0.65
    IMPACT_THRESHOLD_HIGH: float = 0.70
    DEDUPLICATION_WINDOW_HOURS: int = 72
    ENTITY_RESOLUTION_CONFIDENCE_THRESHOLD: float = 0.78

    # Focused Industry
    TARGET_INDUSTRY: str = "AI Infrastructure & Developer Tools"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"


settings = Settings()
