package com.physicsplay.models.dto;

import jakarta.validation.constraints.NotNull;

public record PredictionRequest(
        @NotNull Long studentId
) {
}
