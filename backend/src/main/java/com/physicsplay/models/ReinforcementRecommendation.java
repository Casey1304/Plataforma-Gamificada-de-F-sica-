package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "reinforcement_recommendations")
public class ReinforcementRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false)
    private String reason;

    @Column(name = "recommended_activity", nullable = false)
    private String recommendedActivity;

    @Column(nullable = false)
    private String source;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected ReinforcementRecommendation() {
    }

    public ReinforcementRecommendation(Long studentId, Long topicId, String reason, String recommendedActivity, String source) {
        this.studentId = studentId;
        this.topicId = topicId;
        this.reason = reason;
        this.recommendedActivity = recommendedActivity;
        this.source = source;
    }

    @PrePersist
    void beforeInsert() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (source == null) {
            source = "rules_engine";
        }
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getReason() {
        return reason;
    }

    public String getRecommendedActivity() {
        return recommendedActivity;
    }

    public String getSource() {
        return source;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
