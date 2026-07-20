package com.physicsplay.integrations;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
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
            @Value("${app.google-ai.model:gemini-2.0-flash}") String model,
            @Value("${app.google-ai.connect-timeout-ms:5000}") int connectTimeoutMs,
            @Value("${app.google-ai.read-timeout-ms:15000}") int readTimeoutMs
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .requestFactory(requestFactory)
                .build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    public String generateText(String prompt, double temperature) {
        return generateText(prompt, temperature, 512);
    }

    public String generateText(String prompt, double temperature, int maxOutputTokens) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini no configurado");
        }

        return requestText(Map.of(
                "contents", List.of(content("user", prompt)),
                "generationConfig", generationConfig(temperature, maxOutputTokens)
        ));
    }

    public String generateChat(
            String systemInstruction,
            List<GeminiChatMessage> messages,
            double temperature,
            int maxOutputTokens
    ) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini no configurado");
        }

        List<Map<String, Object>> contents = messages.stream()
                .map(message -> content(message.role(), message.content()))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemInstruction))));
        body.put("contents", contents);
        body.put("generationConfig", generationConfig(temperature, maxOutputTokens));
        return requestText(body);
    }

    private String requestText(Map<String, Object> body) {
        JsonNode geminiResponse = post(body);
        if (geminiResponse == null) {
            throw new IllegalStateException("Gemini devolvió una respuesta vacía");
        }

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

    private JsonNode post(Map<String, Object> body) {
        return restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .body(body)
                .retrieve()
                .body(JsonNode.class);
    }

    private Map<String, Object> content(String role, String text) {
        return Map.of(
                "role", role,
                "parts", List.of(Map.of("text", text))
        );
    }

    private Map<String, Object> generationConfig(double temperature, int maxOutputTokens) {
        return Map.of(
                "temperature", temperature,
                "topP", 0.8,
                "candidateCount", 1,
                "maxOutputTokens", maxOutputTokens
        );
    }

    public String generateJson(String prompt, double temperature) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini no configurado");
        }

        Map<String, Object> generationConfig = new LinkedHashMap<>(generationConfig(temperature, 1024));
        generationConfig.put("response_mime_type", "application/json");
        JsonNode geminiResponse = post(Map.of(
                "contents", List.of(content("user", prompt)),
                "generationConfig", generationConfig
        ));
        if (geminiResponse == null) {
            throw new IllegalStateException("Gemini devolvió una respuesta vacía");
        }

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
