package com.physicsplay.models.dto;

public record AnswerFeedbackResponse(
        boolean correct,
        String feedback,
        Integer score,
        String recommendation,
        Integer earnedXp,
        Integer earnedGems,
        Integer totalXp,
        Integer totalGems,
        Integer currentStreak,
        Integer precisionPercent
) {
}
