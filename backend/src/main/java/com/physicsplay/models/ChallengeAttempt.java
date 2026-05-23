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
@Table(name = "challenge_attempts")
public class ChallengeAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "challenge_id", nullable = false)
    private Long challengeId;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Column(name = "total_time_seconds")
    private Integer totalTimeSeconds;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private String status;

    protected ChallengeAttempt() {
    }

    public ChallengeAttempt(Long studentId, Long challengeId) {
        this.studentId = studentId;
        this.challengeId = challengeId;
        this.score = 0;
        this.status = "in_progress";
    }

    @PrePersist
    void beforeInsert() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
        if (score == null) {
            score = 0;
        }
        if (status == null) {
            status = "in_progress";
        }
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getChallengeId() {
        return challengeId;
    }

    public Integer getScore() {
        return score;
    }

    public void addScore(Integer earnedPoints) {
        this.score += earnedPoints;
    }

    public String getStatus() {
        return status;
    }
}
