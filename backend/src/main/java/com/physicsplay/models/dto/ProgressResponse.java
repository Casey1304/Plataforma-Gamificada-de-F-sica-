package com.physicsplay.models.dto;

import java.math.BigDecimal;

public record ProgressResponse(
        Long topicId,
        String masteryLevel,
        Integer correctAnswers,
        Integer incorrectAnswers,
        BigDecimal averageTimeSeconds
) {
}
