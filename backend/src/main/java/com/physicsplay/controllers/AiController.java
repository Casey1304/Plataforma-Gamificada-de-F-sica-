package com.physicsplay.controllers;

import com.physicsplay.models.dto.PredictionRequest;
import com.physicsplay.models.dto.PredictionResponse;
import com.physicsplay.services.PerformancePredictionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final PerformancePredictionService predictionService;

    public AiController(PerformancePredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/performance-prediction")
    public PredictionResponse predictPerformance(@Valid @RequestBody PredictionRequest request) {
        return predictionService.predict(request.studentId());
    }
}
