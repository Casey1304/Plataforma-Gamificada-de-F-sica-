package com.physicsplay.models.dto;

import jakarta.validation.constraints.NotNull;

public record CreateAttemptRequest(
        @NotNull Long studentId,
        @NotNull Long challengeId
) {
}
