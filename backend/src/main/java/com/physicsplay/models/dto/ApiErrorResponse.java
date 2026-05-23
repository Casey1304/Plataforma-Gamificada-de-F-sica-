package com.physicsplay.models.dto;

import java.time.LocalDateTime;

public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message
) {
}
