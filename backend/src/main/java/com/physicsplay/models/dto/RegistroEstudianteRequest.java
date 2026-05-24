package com.physicsplay.models.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroEstudianteRequest(
        @NotBlank String nombreCompleto,
        @Email @NotBlank String correoElectronico,
        @NotBlank @Size(min = 6) String contrasena
) {
}
