package com.physicsplay.models.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearUsuarioAdminRequest(
        @NotBlank String nombreCompleto,
        @Email @NotBlank String correoElectronico,
        @NotBlank @Size(min = 6) String contrasena,
        @NotBlank String rol,
        @Valid PreferenciasAprendizajeRequest preferencias
) {
}
