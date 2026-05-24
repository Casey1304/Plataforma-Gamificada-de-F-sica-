package com.physicsplay.controllers;

import com.physicsplay.models.dto.AiInsightResponse;
import com.physicsplay.models.dto.ProgressResponse;
import com.physicsplay.models.dto.RecommendationResponse;
import com.physicsplay.models.dto.StudentGamificationResponse;
import com.physicsplay.services.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/{studentId}")
@Tag(name = "Progreso y analiticas", description = "Expone gamificacion, progreso por tema y panel de analisis IA.")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/progress")
    @Operation(summary = "Consulta progreso por tema", description = "Lista dominio, respuestas correctas/incorrectas y tiempo promedio.")
    public List<ProgressResponse> getProgress(@PathVariable Long studentId) {
        return progressService.getProgress(studentId);
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Consulta recomendaciones", description = "Lista recomendaciones historicas generadas por reglas o IA simulada.")
    public List<RecommendationResponse> getRecommendations(@PathVariable Long studentId) {
        return progressService.getRecommendations(studentId);
    }

    @GetMapping("/gamification")
    @Operation(summary = "Consulta estado de gamificacion", description = "Devuelve nivel, XP, gemas y rachas del estudiante.")
    public StudentGamificationResponse getGamification(@PathVariable Long studentId) {
        return progressService.getGamification(studentId);
    }

    @GetMapping("/ai-insights")
    @Operation(summary = "Consulta panel de IA", description = "Devuelve metricas, diagnostico, sugerencias, ejercicios completados y XP diario.")
    public AiInsightResponse getAiInsight(@PathVariable Long studentId) {
        return progressService.getAiInsight(studentId);
    }
}
