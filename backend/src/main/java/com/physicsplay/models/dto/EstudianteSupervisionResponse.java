package com.physicsplay.models.dto;

import java.util.List;

public record EstudianteSupervisionResponse(
        Long estudianteId,
        String nombreCompleto,
        String correo,
        Integer nivel,
        Integer xp,
        Integer gemas,
        Integer rachaActual,
        Integer precisionPorcentaje,
        String temaConMasErrores,
        List<String> aulas
) {
}
