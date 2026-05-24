package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "classroom_enrollments")
public class ClassroomEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "classroom_id", nullable = false)
    private Long classroomId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private String status;

    @Column(name = "enrolled_at", insertable = false, updatable = false)
    private LocalDateTime enrolledAt;

    protected ClassroomEnrollment() {
    }

    public ClassroomEnrollment(Long classroomId, Long studentId) {
        this.classroomId = classroomId;
        this.studentId = studentId;
        this.status = "activo";
    }

    public Long getId() {
        return id;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStatus() {
        return status;
    }
}
