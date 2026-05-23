package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_by_topic")
public class ProgressByTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(name = "completed_challenges", nullable = false)
    private Integer completedChallenges;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "incorrect_answers", nullable = false)
    private Integer incorrectAnswers;

    @Column(name = "average_time_seconds")
    private BigDecimal averageTimeSeconds;

    @Column(name = "mastery_level", nullable = false)
    private String masteryLevel;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected ProgressByTopic() {
    }

    public ProgressByTopic(Long studentId, Long topicId) {
        this.studentId = studentId;
        this.topicId = topicId;
        this.completedChallenges = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.masteryLevel = "inicial";
    }

    @PrePersist
    @PreUpdate
    void beforeSave() {
        updatedAt = LocalDateTime.now();
        if (completedChallenges == null) {
            completedChallenges = 0;
        }
        if (correctAnswers == null) {
            correctAnswers = 0;
        }
        if (incorrectAnswers == null) {
            incorrectAnswers = 0;
        }
        if (masteryLevel == null) {
            masteryLevel = "inicial";
        }
    }

    public Long getTopicId() {
        return topicId;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public BigDecimal getAverageTimeSeconds() {
        return averageTimeSeconds;
    }

    public String getMasteryLevel() {
        return masteryLevel;
    }

    public void registerAnswer(boolean correct, BigDecimal newAverageTimeSeconds) {
        if (correct) {
            correctAnswers++;
        } else {
            incorrectAnswers++;
        }
        averageTimeSeconds = newAverageTimeSeconds;
        masteryLevel = calculateMasteryLevel();
    }

    private String calculateMasteryLevel() {
        if (correctAnswers >= 6 && incorrectAnswers <= 2) {
            return "avanzado";
        }
        if (correctAnswers >= incorrectAnswers) {
            return "en_progreso";
        }
        return "requiere_refuerzo";
    }
}
