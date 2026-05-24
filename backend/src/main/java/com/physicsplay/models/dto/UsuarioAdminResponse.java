package com.physicsplay.models.dto;

import java.time.LocalDateTime;

public record UsuarioAdminResponse(
        Long usuarioId,
        Long estudianteId,
        String nombreCompleto,
        String correoElectronico,
        String rol,
        String estado,
        LocalDateTime ultimoInicioSesion,
        LocalDateTime fechaCreacion
) {
}
