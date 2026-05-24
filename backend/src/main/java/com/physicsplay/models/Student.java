package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String grade;

    private String email;

    @Column(nullable = false)
    private Integer level;

    @Column(name = "xp_total", nullable = false)
    private Integer xpTotal;

    @Column(nullable = false)
    private Integer gems;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak;

    @Column(name = "best_streak", nullable = false)
    private Integer bestStreak;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Student() {
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Integer getLevel() {
        return level;
    }

    public Integer getXpTotal() {
        return xpTotal;
    }

    public Integer getGems() {
        return gems;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public Integer getBestStreak() {
        return bestStreak;
    }

    public void applyReward(int xp, int earnedGems, boolean correct) {
        if (level == null) {
            level = 1;
        }
        if (xpTotal == null) {
            xpTotal = 0;
        }
        if (gems == null) {
            gems = 0;
        }
        if (currentStreak == null) {
            currentStreak = 0;
        }
        if (bestStreak == null) {
            bestStreak = 0;
        }

        xpTotal += xp;
        gems += earnedGems;
        currentStreak = correct ? currentStreak + 1 : 0;
        bestStreak = Math.max(bestStreak, currentStreak);
        level = Math.max(1, Math.min(99, (xpTotal / 100) + 3));
    }
}
