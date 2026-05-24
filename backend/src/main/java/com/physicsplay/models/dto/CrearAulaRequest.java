package com.physicsplay.models.dto;

import jakarta.validation.constraints.NotBlank;

public record CrearAulaRequest(
        @NotBlank String nombre,
        String grado,
        String seccion
) {
}
