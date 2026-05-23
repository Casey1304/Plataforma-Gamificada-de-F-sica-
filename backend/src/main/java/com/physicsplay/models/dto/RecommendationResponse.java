package com.physicsplay.models.dto;

import java.time.LocalDateTime;

public record RecommendationResponse(
        Long topicId,
        String reason,
        String recommendedActivity,
        String source,
        LocalDateTime createdAt
) {
}
