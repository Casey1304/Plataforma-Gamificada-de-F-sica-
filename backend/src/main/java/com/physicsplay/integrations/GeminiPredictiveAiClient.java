package com.physicsplay.integrations;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.physicsplay.models.dto.PredictiveAnalysisRequest;
import com.physicsplay.models.dto.PredictiveAnalysisResponse;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Component
public class GeminiPredictiveAiClient {
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiPredictiveAiClient(
            ObjectMapper objectMapper,
            @Value("${app.google-ai.api-key:}") String apiKey,
            @Value("${app.google-ai.model:gemini-1.5-flash}") String model
    ) {
        this.restClient = RestClient.create("https://generativelanguage.googleapis.com");
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    public PredictiveAnalysisResponse predict(PredictiveAnalysisRequest request) {
        if (!StringUtils.hasText(apiKey)) {
            return fallbackPrediction(request);
        }

        try {
            JsonNode geminiResponse = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .body(buildGeminiPayload(request))
                    .retrieve()
                    .body(JsonNode.class);

            String content = geminiResponse
                    .path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();

            return objectMapper.readValue(cleanJson(content), PredictiveAnalysisResponse.class);
        } catch (Exception ignored) {
            return fallbackPrediction(request);
        }
    }

    private Map<String, Object> buildGeminiPayload(PredictiveAnalysisRequest request) {
        return Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", buildPrompt(request))))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.25,
                        "response_mime_type", "application/json"
                )
        );
    }

    private String buildPrompt(PredictiveAnalysisRequest request) {
        return """
                Actua como motor predictivo educativo para PhysicsPlay 2.0.
                Analiza el patron conductual y de rendimiento del estudiante.

                Datos actuales:
                - Alumno: %s
                - Racha de errores: %d
                - Respuestas incorrectas consecutivas: %d
                - Tiempo promedio por intento: %d segundos
                - Tema actual con dificultad: %s

                Regla central:
                Si el alumno viene fallando varias veces seguidas y promedia menos de 15 segundos por intento,
                predice frustracion, abandono o persistencia de error conceptual.

                Responde exclusivamente con JSON valido, sin markdown, sin explicaciones externas y con esta estructura exacta:
                {
                  "analytics": {
                    "tiempoPromedio": "string",
                    "intentosFallidos": 0,
                    "temaMasErrores": "string"
                  },
                  "prediction": {
                    "alerta": "string",
                    "tendencia": "string"
                  },
                  "aiRecommendation": ["string", "string"],
                  "nextCustomChallenge": {
                    "pregunta": "string",
                    "opciones": {
                      "A": "string",
                      "B": "string",
                      "C": "string",
                      "D": "string"
                    },
                    "respuestaCorrecta": "string"
                  }
                }
                """.formatted(
                request.estudiante(),
                request.rachaErrores(),
                request.respuestasIncorrectasConsecutivas(),
                request.tiempoPromedioSegundos(),
                request.temaActual()
        );
    }

    private String cleanJson(String content) {
        if (content == null) {
            return "{}";
        }
        return content
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private PredictiveAnalysisResponse fallbackPrediction(PredictiveAnalysisRequest request) {
        boolean highRisk = request.respuestasIncorrectasConsecutivas() >= 3
                && request.tiempoPromedioSegundos() < 15;
        String alert = highRisk
                ? "Alta probabilidad de frustracion o abandono en el reto actual si no se refuerza la teoria."
                : "Riesgo moderado: conviene reforzar el tema antes de aumentar la dificultad.";
        String tendency = highRisk
                ? "Riesgo critico de persistencia de error por respuesta impulsiva y confusion conceptual."
                : "Tendencia recuperable si se alternan pistas, practica guiada y retroalimentacion inmediata.";

        return new PredictiveAnalysisResponse(
                new PredictiveAnalysisResponse.Analytics(
                        request.tiempoPromedioSegundos() + "s",
                        request.respuestasIncorrectasConsecutivas(),
                        request.temaActual()
                ),
                new PredictiveAnalysisResponse.Prediction(alert, tendency),
                List.of(
                        "Revisar la teoria base de " + request.temaActual() + " antes de otro intento.",
                        "Resolver un ejercicio guiado con sustitucion paso a paso.",
                        "Comparar la respuesta con unidades fisicas para detectar errores conceptuales."
                ),
                new PredictiveAnalysisResponse.NextCustomChallenge(
                        "Un bloque de 8 kg acelera a 2 m/s2. ¿Cual es la fuerza neta aplicada?",
                        new PredictiveAnalysisResponse.ChallengeOptions("10 N", "16 N", "24 N", "32 N"),
                        "16 N"
                )
        );
    }
}
