package com.physicsplay.models.dto;

public record StudentGamificationResponse(
        Long studentId,
        String fullName,
        Integer level,
        Integer xpTotal,
        Integer xpForCurrentLevel,
        Integer xpForNextLevel,
        Integer gems,
        Integer currentStreak,
        Integer bestStreak
) {
}
