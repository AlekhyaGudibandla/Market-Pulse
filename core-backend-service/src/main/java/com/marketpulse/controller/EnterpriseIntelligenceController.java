package com.marketpulse.controller;

import com.marketpulse.model.CompetitiveAlertDTO;
import com.marketpulse.service.EnterpriseAlertOrchestrator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/enterprise")
@CrossOrigin(origins = "*")
public class EnterpriseIntelligenceController {

    private final EnterpriseAlertOrchestrator orchestrator;

    public EnterpriseIntelligenceController(EnterpriseAlertOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<CompetitiveAlertDTO>> getEnterpriseAlerts(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(orchestrator.getRecentAlerts(limit));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "MarketPulse Enterprise Core",
                "framework", "Spring Boot 3.2.3",
                "status", "UP",
                "kafka_consumer_group", "marketpulse-enterprise-group"
        ));
    }
}
