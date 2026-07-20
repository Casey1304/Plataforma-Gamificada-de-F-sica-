package com.physicsplay.controllers;

import com.physicsplay.models.dto.ConnorChatRequest;
import com.physicsplay.models.dto.ConnorChatResponse;
import com.physicsplay.services.ConnorChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tutor-ia/connor")
@Tag(name = "Connor", description = "Chatbot educativo de física para estudiantes autenticados.")
public class ConnorChatController {
    private final ConnorChatService connorChatService;

    public ConnorChatController(ConnorChatService connorChatService) {
        this.connorChatService = connorChatService;
    }

    @PostMapping("/chat")
    @Operation(summary = "Pregunta a Connor", description = "Responde preguntas escolares de física con Google Gemini.")
    public ConnorChatResponse chat(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody ConnorChatRequest request
    ) {
        return connorChatService.chat(userId, request);
    }
}
