package com.marketpulse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketpulse.config.KafkaEnterpriseConfig;
import com.marketpulse.model.CompetitiveAlertDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class EnterpriseAlertOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(EnterpriseAlertOrchestrator.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<CompetitiveAlertDTO> alertCache = Collections.synchronizedList(new LinkedList<>());

    @KafkaListener(topics = KafkaEnterpriseConfig.ALERTS_TOPIC, groupId = "marketpulse-enterprise-group")
    public void consumeAlert(String alertJson) {
        try {
            CompetitiveAlertDTO alert = objectMapper.readValue(alertJson, CompetitiveAlertDTO.class);
            log.info("Enterprise Core received alert: [{}] - {}", alert.getId(), alert.getEventTitle());
            alertCache.add(0, alert);
            if (alertCache.size() > 500) {
                alertCache.remove(alertCache.size() - 1);
            }
        } catch (Exception e) {
            log.error("Failed to parse alert from Kafka: {}", e.getMessage());
        }
    }

    public List<CompetitiveAlertDTO> getRecentAlerts(int limit) {
        synchronized (alertCache) {
            return alertCache.stream().limit(limit).toList();
        }
    }
}
