package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "teacher_profiles")
public class TeacherProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private String specialty;

    private String institution;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected TeacherProfile() {
    }

    public TeacherProfile(Long userId, String specialty, String institution) {
        this.userId = userId;
        this.specialty = specialty;
        this.institution = institution;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
