package com.marketpulse.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaEnterpriseConfig {

    public static final String RAW_EVENTS_TOPIC = "events.raw";
    public static final String ALERTS_TOPIC = "alerts.generated";
    public static final String DLQ_TOPIC = "events.dlq";

    @Bean
    public NewTopic rawEventsTopic() {
        return TopicBuilder.name(RAW_EVENTS_TOPIC)
                .partitions(8)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic alertsTopic() {
        return TopicBuilder.name(ALERTS_TOPIC)
                .partitions(8)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic dlqTopic() {
        return TopicBuilder.name(DLQ_TOPIC)
                .partitions(4)
                .replicas(1)
                .build();
    }
}
