package com.physicsplay.models.dto;

import java.time.OffsetDateTime;

public record ConnorChatResponse(
        String asistente,
        String respuesta,
        OffsetDateTime fechaHora
) {
}
