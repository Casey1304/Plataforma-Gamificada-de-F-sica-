package com.physicsplay.models.dto;

import java.util.List;

public record PersonalizedExerciseResponse(
        String topic,
        String statement,
        List<String> options,
        String expectedAnswer,
        String hint
) {
}
