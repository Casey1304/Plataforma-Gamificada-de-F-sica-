package com.physicsplay.models.dto;

public record ClassroomResponse(
        Long id,
        String name,
        String grade,
        String sectionCode,
        String status,
        int enrolledStudents
) {
}
