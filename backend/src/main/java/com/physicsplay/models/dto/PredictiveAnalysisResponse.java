package com.physicsplay.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record PredictiveAnalysisResponse(
        Analytics analytics,
        Prediction prediction,
        List<String> aiRecommendation,
        NextCustomChallenge nextCustomChallenge
) {
    public record Analytics(
            String tiempoPromedio,
            Integer intentosFallidos,
            String temaMasErrores
    ) {
    }

    public record Prediction(
            String alerta,
            String tendencia
    ) {
    }

    public record NextCustomChallenge(
            String pregunta,
            ChallengeOptions opciones,
            String respuestaCorrecta
    ) {
    }

    public record ChallengeOptions(
            @JsonProperty("A") String optionA,
            @JsonProperty("B") String optionB,
            @JsonProperty("C") String optionC,
            @JsonProperty("D") String optionD
    ) {
    }
}
