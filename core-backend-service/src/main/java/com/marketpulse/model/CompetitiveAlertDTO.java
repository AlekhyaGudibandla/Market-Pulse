package com.marketpulse.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CompetitiveAlertDTO {
    private String id;
    private String eventId;
    private String eventTitle;
    private Instant timestamp;
    private String whatChanged;
    private String whyItMatters;
    private String historicalContext;
    private String primaryEntityId;
    private String primaryEntityName;
    private List<Map<String, Object>> affectedCompetitors;
    private List<String> affectedTechnologies;
    private List<String> recommendedStrategicActions;

    public CompetitiveAlertDTO() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getWhatChanged() { return whatChanged; }
    public void setWhatChanged(String whatChanged) { this.whatChanged = whatChanged; }

    public String getWhyItMatters() { return whyItMatters; }
    public void setWhyItMatters(String whyItMatters) { this.whyItMatters = whyItMatters; }

    public String getHistoricalContext() { return historicalContext; }
    public void setHistoricalContext(String historicalContext) { this.historicalContext = historicalContext; }

    public String getPrimaryEntityId() { return primaryEntityId; }
    public void setPrimaryEntityId(String primaryEntityId) { this.primaryEntityId = primaryEntityId; }

    public String getPrimaryEntityName() { return primaryEntityName; }
    public void setPrimaryEntityName(String primaryEntityName) { this.primaryEntityName = primaryEntityName; }

    public List<Map<String, Object>> getAffectedCompetitors() { return affectedCompetitors; }
    public void setAffectedCompetitors(List<Map<String, Object>> affectedCompetitors) { this.affectedCompetitors = affectedCompetitors; }

    public List<String> getAffectedTechnologies() { return affectedTechnologies; }
    public void setAffectedTechnologies(List<String> affectedTechnologies) { this.affectedTechnologies = affectedTechnologies; }

    public List<String> getRecommendedStrategicActions() { return recommendedStrategicActions; }
    public void setRecommendedStrategicActions(List<String> recommendedStrategicActions) { this.recommendedStrategicActions = recommendedStrategicActions; }
}
