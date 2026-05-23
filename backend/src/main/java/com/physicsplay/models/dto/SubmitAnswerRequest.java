package com.physicsplay.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmitAnswerRequest(
        @NotNull Long exerciseId,
        @NotBlank String submittedAnswer,
        Integer attemptNumber,
        Integer responseTimeSeconds
) {
}
