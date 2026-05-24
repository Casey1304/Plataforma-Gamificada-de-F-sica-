package com.physicsplay.models.dto;

import java.util.List;

public record ExerciseResponse(
        Long id,
        String statement,
        String correctAnswer,
        String explanation,
        Integer points,
        List<String> options,
        String visualType
) {
}
