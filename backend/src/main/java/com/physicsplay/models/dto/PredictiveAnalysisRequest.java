package com.physicsplay.models.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PredictiveAnalysisRequest(
        @NotBlank String estudiante,
        @NotNull @Min(0) Integer rachaErrores,
        @NotNull @Min(0) Integer respuestasIncorrectasConsecutivas,
        @NotNull @Min(1) Integer tiempoPromedioSegundos,
        @NotBlank String temaActual
) {
}
