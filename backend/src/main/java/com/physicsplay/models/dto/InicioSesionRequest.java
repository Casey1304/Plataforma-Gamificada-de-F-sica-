package com.physicsplay.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InicioSesionRequest(
        @Email @NotBlank String correoElectronico,
        @NotBlank String contrasena
) {
}
