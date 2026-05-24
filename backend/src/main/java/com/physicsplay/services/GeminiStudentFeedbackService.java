package com.physicsplay.services;

import com.physicsplay.integrations.GeminiContentClient;
import com.physicsplay.models.Exercise;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Service;

@Service
public class GeminiStudentFeedbackService {
    private static final List<String> CORRECT_FALLBACK = List.of(
            "¡Excelente! Tu respuesta es correcta. Sigue así y ganarás más XP y gemas.",
            "¡Lo lograste! Entendiste bien el concepto. Puedes pasar al siguiente ejercicio.",
            "¡Muy bien! Vas por buen camino en esta misión de física."
    );
    private static final List<String> INCORRECT_FALLBACK = List.of(
            "Casi. Lee el enunciado otra vez y fíjate en las unidades (N, kg, m/s²).",
            "No te rindas: revisa la pista y elige otra opción. ¡Tú puedes!",
            "Este intento no fue correcto, pero cada error te ayuda a aprender."
    );

    private final GeminiContentClient geminiContentClient;

    public GeminiStudentFeedbackService(GeminiContentClient geminiContentClient) {
        this.geminiContentClient = geminiContentClient;
    }

    public FeedbackResult buildFeedback(
            boolean correct,
            Exercise exercise,
            String submittedAnswer,
            String studentName
    ) {
        String base = exercise.getExplanation() == null ? "" : exercise.getExplanation();
        if (!geminiContentClient.isConfigured()) {
            return new FeedbackResult(pickFallback(correct, base), false);
        }

        try {
            String prompt = """
                    Eres un tutor de física para estudiantes de 5.º de secundaria en Perú.
                    Escribe en español claro, amable y breve (máximo 3 oraciones cortas).
                    No uses markdown ni listas. No repitas literalmente el enunciado.

                    Nombre del estudiante: %s
                    ¿Respuesta correcta?: %s
                    Enunciado: %s
                    Respuesta del estudiante: %s
                    Respuesta esperada: %s
                    Explicación base del banco: %s

                    Si acertó: felicita con entusiasio y explica por qué está bien.
                    Si falló: anima sin regañar, da una pista concreta y di qué puede revisar.
                    """.formatted(
                    studentName == null ? "estudiante" : studentName,
                    correct ? "sí" : "no",
                    exercise.getStatement(),
                    submittedAnswer,
                    exercise.getCorrectAnswer(),
                    base
            );

            String message = geminiContentClient.generateText(prompt, 0.85);
            return new FeedbackResult(message, true);
        } catch (Exception ignored) {
            return new FeedbackResult(pickFallback(correct, base), false);
        }
    }

    private String pickFallback(boolean correct, String base) {
        String intro = correct
                ? CORRECT_FALLBACK.get(ThreadLocalRandom.current().nextInt(CORRECT_FALLBACK.size()))
                : INCORRECT_FALLBACK.get(ThreadLocalRandom.current().nextInt(INCORRECT_FALLBACK.size()));
        if (base == null || base.isBlank()) {
            return intro;
        }
        return correct ? "¡Correcto! " + base : "Aún no. " + base + " " + intro;
    }

    public record FeedbackResult(String message, boolean fromGemini) {
    }
}
