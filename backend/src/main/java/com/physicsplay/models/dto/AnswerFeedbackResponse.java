package com.physicsplay.models.dto;

public record AnswerFeedbackResponse(
        boolean correct,
        String feedback,
        Integer score,
        String recommendation
) {
}
