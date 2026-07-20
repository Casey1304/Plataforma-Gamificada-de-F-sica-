package com.physicsplay.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ConnorContextMessage(
        @NotBlank(message = "Cada mensaje del contexto debe indicar quién lo envió.")
        @Pattern(regexp = "usuario|asistente", message = "El contexto contiene un rol no permitido.")
        String rol,
        @NotBlank(message = "Los mensajes del contexto no pueden estar vacíos.")
        @Size(max = 500, message = "Un mensaje del contexto supera 500 caracteres.")
        String contenido
) {
}
