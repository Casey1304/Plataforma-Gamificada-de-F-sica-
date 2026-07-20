package com.physicsplay.models.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ConnorChatRequest(
        @NotBlank(message = "Escribe una pregunta para Connor.")
        @Size(max = 500, message = "La pregunta no puede superar 500 caracteres.")
        String pregunta,
        @Size(max = 4, message = "El contexto no puede superar 4 mensajes.")
        List<@Valid ConnorContextMessage> contextoReciente
) {
}
