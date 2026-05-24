package com.physicsplay.integrations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.physicsplay.models.dto.PredictiveAnalysisRequest;
import com.physicsplay.models.dto.PredictiveAnalysisResponse;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Component;

@Component
public class GeminiPredictiveAiClient {
    private final ObjectMapper objectMapper;
    private final GeminiContentClient geminiContentClient;

    public GeminiPredictiveAiClient(ObjectMapper objectMapper, GeminiContentClient geminiContentClient) {
        this.objectMapper = objectMapper;
        this.geminiContentClient = geminiContentClient;
    }

    public PredictiveAnalysisResponse predict(PredictiveAnalysisRequest request) {
        if (!geminiContentClient.isConfigured()) {
            return fallbackPrediction(request, true);
        }

        try {
            String content = geminiContentClient.generateJson(buildPrompt(request), 0.75);
            return objectMapper.readValue(content, PredictiveAnalysisResponse.class);
        } catch (Exception ignored) {
            return fallbackPrediction(request, true);
        }
    }

    private String buildPrompt(PredictiveAnalysisRequest request) {
        int variationSeed = ThreadLocalRandom.current().nextInt(1000, 9999);
        return """
                Actua como motor predictivo educativo para PhysicsPlay 2.0.
                Publico: estudiantes de 5.º de secundaria. Usa español claro y motivador.
                Semilla de variacion: %d (genera un reto DISTINTO a ejercicios tipicos repetidos).

                Datos actuales:
                - Alumno: %s
                - Racha de errores: %d
                - Respuestas incorrectas consecutivas: %d
                - Tiempo promedio por intento: %d segundos
                - Tema actual con dificultad: %s

                Regla central:
                Si el alumno viene fallando varias veces seguidas y promedia menos de 15 segundos por intento,
                predice frustracion, abandono o persistencia de error conceptual.

                El ejercicio personalizado debe ser de fisica dinamica (fuerza, masa, aceleracion o leyes de Newton),
                con 4 opciones plausibles y una sola respuesta correcta.

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
                variationSeed,
                request.estudiante(),
                request.rachaErrores(),
                request.respuestasIncorrectasConsecutivas(),
                request.tiempoPromedioSegundos(),
                request.temaActual()
        );
    }

    private PredictiveAnalysisResponse fallbackPrediction(PredictiveAnalysisRequest request, boolean rotate) {
        boolean highRisk = request.respuestasIncorrectasConsecutivas() >= 3
                && request.tiempoPromedioSegundos() < 15;
        String alert = highRisk
                ? "Vamos con calma: repasa la teoría antes del siguiente intento. ¡Tú puedes!"
                : "Vas bien. Un poco más de práctica en " + request.temaActual() + " y subirás de nivel.";
        String tendency = highRisk
                ? "Conviene leer el enunciado con calma y revisar las unidades antes de responder."
                : "Sigue practicando: cada intento te acerca a dominar el tema.";

        List<PredictiveAnalysisResponse.NextCustomChallenge> pool = List.of(
                new PredictiveAnalysisResponse.NextCustomChallenge(
                        "Un bloque de 8 kg acelera a 2 m/s². ¿Cuál es la fuerza neta?",
                        new PredictiveAnalysisResponse.ChallengeOptions("10 N", "16 N", "24 N", "32 N"),
                        "16 N"
                ),
                new PredictiveAnalysisResponse.NextCustomChallenge(
                        "¿Qué ley explica que un cuerpo sigue en reposo si no hay fuerza neta?",
                        new PredictiveAnalysisResponse.ChallengeOptions(
                                "Primera ley de Newton",
                                "Segunda ley de Newton",
                                "Tercera ley de Newton",
                                "Ley de gravitación"
                        ),
                        "Primera ley de Newton"
                ),
                new PredictiveAnalysisResponse.NextCustomChallenge(
                        "Una masa de 5 kg tiene aceleración de 4 m/s². ¿Cuál es la fuerza?",
                        new PredictiveAnalysisResponse.ChallengeOptions("9 N", "20 N", "25 N", "40 N"),
                        "20 N"
                )
        );
        int index = rotate ? ThreadLocalRandom.current().nextInt(pool.size()) : 0;

        return new PredictiveAnalysisResponse(
                new PredictiveAnalysisResponse.Analytics(
                        request.tiempoPromedioSegundos() + "s",
                        request.respuestasIncorrectasConsecutivas(),
                        request.temaActual()
                ),
                new PredictiveAnalysisResponse.Prediction(alert, tendency),
                List.of(
                        "Repasar " + request.temaActual() + " con un ejemplo sencillo.",
                        "Resolver un ejercicio paso a paso con la fórmula F = m × a.",
                        "Volver a intentar el reto cuando te sientas listo."
                ),
                pool.get(index)
        );
    }
}
