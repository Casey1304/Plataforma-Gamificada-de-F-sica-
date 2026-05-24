package com.physicsplay.controllers;

import com.physicsplay.models.dto.PersonalizedExerciseResponse;
import com.physicsplay.models.dto.PredictiveAnalysisRequest;
import com.physicsplay.models.dto.PredictiveAnalysisResponse;
import com.physicsplay.models.dto.PredictionRequest;
import com.physicsplay.models.dto.PredictionResponse;
import com.physicsplay.services.PerformancePredictionService;
import com.physicsplay.services.PredictiveAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "Inteligencia Artificial", description = "Simula predicciones y generacion de ejercicios personalizados.")
public class AiController {
    private final PerformancePredictionService predictionService;
    private final PredictiveAnalysisService predictiveAnalysisService;

    public AiController(
            PerformancePredictionService predictionService,
            PredictiveAnalysisService predictiveAnalysisService
    ) {
        this.predictionService = predictionService;
        this.predictiveAnalysisService = predictiveAnalysisService;
    }

    @PostMapping("/performance-prediction")
    @Operation(summary = "Predice desempeno", description = "Analiza progreso historico para detectar temas dificiles y recomendar refuerzo.")
    public PredictionResponse predictPerformance(@Valid @RequestBody PredictionRequest request) {
        return predictionService.predict(request.studentId());
    }

    @PostMapping("/personalized-exercises")
    @Operation(summary = "Genera ejercicios personalizados", description = "Devuelve ejercicios simulados por IA segun los temas con menor desempeno.")
    public List<PersonalizedExerciseResponse> generatePersonalizedExercises(@Valid @RequestBody PredictionRequest request) {
        return predictionService.generatePersonalizedExercises(request.studentId());
    }

    @PostMapping("/predictive-analysis")
    @Operation(summary = "Analisis predictivo Gemini", description = "Consume Gemini 1.5 Flash para predecir riesgo conductual y generar un reto personalizado.")
    public PredictiveAnalysisResponse analyzePredictiveRisk(@Valid @RequestBody PredictiveAnalysisRequest request) {
        return predictiveAnalysisService.analyze(request);
    }
}
