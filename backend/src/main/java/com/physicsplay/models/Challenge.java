package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "level_number", nullable = false)
    private Integer levelNumber;

    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints;

    @Column(name = "time_limit_seconds")
    private Integer timeLimitSeconds;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Challenge() {
    }

    public Long getId() {
        return id;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getLevelNumber() {
        return levelNumber;
    }

    public Integer getRewardPoints() {
        return rewardPoints;
    }

    public Integer getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
