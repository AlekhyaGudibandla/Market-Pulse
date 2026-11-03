import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.seed.ai_infrastructure_seed import seed_knowledge_base
from app.pipeline.ingestion.simulated_stream import pipeline_service
from app.api.v1.events import router as events_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.graph import router as graph_router
from app.api.v1.intelligence import router as intelligence_router
from app.api.v1.competitors import router as competitors_router
from app.api.v1.stream import router as stream_router
from app.api.v1.health import router as health_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("marketpulse.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing MarketPulse Intelligence Engine...")
    # 1. Initialize seed knowledge base (Graph & Vector docs)
    seed_knowledge_base()
    # 2. Bootstrap initial intelligence alerts feed
    await pipeline_service.bootstrap_initial_events()
    logger.info("MarketPulse successfully initialized and ready for streaming intelligence.")
    yield
    logger.info("MarketPulse shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API V1 Routes
app.include_router(events_router, prefix=f"{settings.API_V1_STR}/events", tags=["Events"])
app.include_router(alerts_router, prefix=f"{settings.API_V1_STR}/alerts", tags=["Alerts"])
app.include_router(graph_router, prefix=f"{settings.API_V1_STR}/graph", tags=["Knowledge Graph"])
app.include_router(intelligence_router, prefix=f"{settings.API_V1_STR}/intelligence", tags=["Intelligence & RAG"])
app.include_router(competitors_router, prefix=f"{settings.API_V1_STR}/competitors", tags=["Competitors"])
app.include_router(stream_router, prefix=f"{settings.API_V1_STR}/stream", tags=["Streaming"])
app.include_router(health_router, prefix=f"{settings.API_V1_STR}", tags=["Health & Reconciliation"])


@app.get("/", summary="Root status")
async def root():
    return {
        "product": "MarketPulse — Competitive Intelligence Engine",
        "tagline": "Continuous landscape modeling, change impact detection, and traceable evidence-grounded intelligence",
        "industry_vertical": settings.TARGET_INDUSTRY,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
