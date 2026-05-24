package com.physicsplay.models.dto;

import java.util.List;

public record EstudianteDetalleSupervisionResponse(
        EstudianteSupervisionResponse resumen,
        List<ProgressResponse> progresoPorTema,
        List<RecommendationResponse> recomendaciones,
        AiInsightResponse panelIa
) {
}
