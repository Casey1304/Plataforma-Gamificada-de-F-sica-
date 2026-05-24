package com.physicsplay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "classrooms")
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teacher_profile_id", nullable = false)
    private Long teacherProfileId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String grade;

    @Column(name = "section_code")
    private String sectionCode;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Classroom() {
    }

    public Classroom(Long teacherProfileId, String name, String grade, String sectionCode) {
        this.teacherProfileId = teacherProfileId;
        this.name = name;
        this.grade = grade == null || grade.isBlank() ? "5to de secundaria" : grade;
        this.sectionCode = sectionCode;
        this.status = "activo";
    }

    public Long getId() {
        return id;
    }

    public Long getTeacherProfileId() {
        return teacherProfileId;
    }

    public String getName() {
        return name;
    }

    public String getGrade() {
        return grade;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public String getStatus() {
        return status;
    }
}
