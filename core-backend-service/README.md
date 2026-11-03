# MarketPulse — Enterprise Core Backend (Java + Spring Boot)

This module provides the enterprise-grade event consumer, compliance auditing, and alert routing layer built with **Java 21 + Spring Boot 3**.

## Architecture & Integration
- **Kafka Consumers**: Subscribes to `alerts.generated` and `events.raw` using Spring Kafka with partitioned consumer groups.
- **Enterprise Actuator**: Exposes health, metrics, and Prometheus endpoints for SRE and Kubernetes monitoring.
- **Microservice Decoupling**: Cooperates with the Python FastAPI Intelligence & RAG engine over Apache Kafka.
