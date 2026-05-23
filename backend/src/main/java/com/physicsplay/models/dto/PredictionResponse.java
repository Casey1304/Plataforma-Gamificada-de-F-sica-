package com.physicsplay.models.dto;

import java.util.List;

public record PredictionResponse(
        Long studentId,
        List<String> predictedDifficultTopics,
        String recommendation
) {
}
