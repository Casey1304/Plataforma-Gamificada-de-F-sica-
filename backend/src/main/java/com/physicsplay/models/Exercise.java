package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "exercises")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "challenge_id", nullable = false)
    private Long challengeId;

    @Column(nullable = false)
    private String statement;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @Column(nullable = false)
    private String explanation;

    @Column(name = "error_pattern")
    private String errorPattern;

    @Column(nullable = false)
    private Integer points;

    protected Exercise() {
    }

    public Long getId() {
        return id;
    }

    public Long getChallengeId() {
        return challengeId;
    }

    public String getStatement() {
        return statement;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public String getErrorPattern() {
        return errorPattern;
    }

    public Integer getPoints() {
        return points;
    }
}
