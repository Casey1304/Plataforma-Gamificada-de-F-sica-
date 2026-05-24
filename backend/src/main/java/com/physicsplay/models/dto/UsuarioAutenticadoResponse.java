package com.physicsplay.models.dto;

public record UsuarioAutenticadoResponse(
        Long usuarioId,
        Long estudianteId,
        String nombreCompleto,
        String correoElectronico,
        String rol,
        Integer nivel,
        Integer xp,
        Integer gemas,
        Integer rachaActual
) {
}
