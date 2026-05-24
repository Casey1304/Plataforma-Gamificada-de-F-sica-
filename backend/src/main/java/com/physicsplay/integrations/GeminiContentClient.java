package com.physicsplay.integrations;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Component
public class GeminiContentClient {
    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GeminiContentClient(
            @Value("${app.google-ai.api-key:}") String apiKey,
            @Value("${app.google-ai.model:gemini-2.0-flash}") String model
    ) {
        this.restClient = RestClient.create("https://generativelanguage.googleapis.com");
        this.apiKey = apiKey;
        this.model = model;
    }

    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    public String generateText(String prompt, double temperature) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini no configurado");
        }

        JsonNode geminiResponse = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .body(Map.of(
                        "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                        "generationConfig", Map.of(
                                "temperature", temperature,
                                "topP", 0.95,
                                "maxOutputTokens", 512
                        )
                ))
                .retrieve()
                .body(JsonNode.class);

        String content = geminiResponse
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText(null);

        if (!StringUtils.hasText(content)) {
            throw new IllegalStateException("Gemini devolvio respuesta vacia");
        }
        return content.trim();
    }

    public String generateJson(String prompt, double temperature) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini no configurado");
        }

        JsonNode geminiResponse = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .body(Map.of(
                        "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                        "generationConfig", Map.of(
                                "temperature", temperature,
                                "topP", 0.95,
                                "response_mime_type", "application/json",
                                "maxOutputTokens", 1024
                        )
                ))
                .retrieve()
                .body(JsonNode.class);

        String content = geminiResponse
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText("{}");

        return cleanJson(content);
    }

    public static String cleanJson(String content) {
        if (content == null) {
            return "{}";
        }
        return content
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }
}
