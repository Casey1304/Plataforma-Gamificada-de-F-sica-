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
@Table(name = "exercise_answers")
public class ExerciseAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_id", nullable = false)
    private Long attemptId;

    @Column(name = "exercise_id", nullable = false)
    private Long exerciseId;

    @Column(name = "submitted_answer", nullable = false)
    private String submittedAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean correct;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;

    @Column(name = "response_time_seconds")
    private Integer responseTimeSeconds;

    private String feedback;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected ExerciseAnswer() {
    }

    public ExerciseAnswer(
            Long attemptId,
            Long exerciseId,
            String submittedAnswer,
            Boolean correct,
            Integer attemptNumber,
            Integer responseTimeSeconds,
            String feedback
    ) {
        this.attemptId = attemptId;
        this.exerciseId = exerciseId;
        this.submittedAnswer = submittedAnswer;
        this.correct = correct;
        this.attemptNumber = attemptNumber;
        this.responseTimeSeconds = responseTimeSeconds;
        this.feedback = feedback;
    }

    @PrePersist
    void beforeInsert() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (attemptNumber == null) {
            attemptNumber = 1;
        }
    }
}
