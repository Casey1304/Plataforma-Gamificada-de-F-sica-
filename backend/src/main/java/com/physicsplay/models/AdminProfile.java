package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_profiles")
public class AdminProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "access_level", nullable = false)
    private String accessLevel;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected AdminProfile() {
    }

    public AdminProfile(Long userId, String accessLevel) {
        this.userId = userId;
        this.accessLevel = accessLevel == null || accessLevel.isBlank() ? "general" : accessLevel;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getAccessLevel() {
        return accessLevel;
    }
}
