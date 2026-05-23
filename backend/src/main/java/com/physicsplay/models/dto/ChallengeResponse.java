package com.physicsplay.models.dto;

import java.util.List;

public record ChallengeResponse(
        Long id,
        Long topicId,
        String title,
        String description,
        Integer levelNumber,
        Integer rewardPoints,
        Integer timeLimitSeconds,
        List<ExerciseResponse> exercises
) {
}
