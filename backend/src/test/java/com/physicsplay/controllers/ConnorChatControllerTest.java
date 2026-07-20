package com.physicsplay.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.physicsplay.integrations.GeminiContentClient;
import com.physicsplay.middleware.GlobalExceptionHandler;
import com.physicsplay.models.dto.ConnorChatRequest;
import com.physicsplay.models.dto.ConnorChatResponse;
import com.physicsplay.services.ConnorChatService;
import com.physicsplay.services.RoleAuthorizationService;
import java.time.OffsetDateTime;
import java.util.Arrays;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

class ConnorChatControllerTest {
    private StubConnorChatService service;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        service = new StubConnorChatService();
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ConnorChatController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void delegatesValidRequestToService() throws Exception {
        service.response = new ConnorChatResponse(
                "Connor",
                "F = m × a.",
                OffsetDateTime.parse("2026-07-20T12:00:00Z")
        );

        mockMvc.perform(post("/api/tutor-ia/connor/chat")
                        .header("X-User-Id", "12")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"pregunta":"¿Qué es la fuerza?","contextoReciente":[]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.asistente").value("Connor"))
                .andExpect(jsonPath("$.respuesta").value("F = m × a."));

        assertThat(service.userId).isEqualTo(12L);
        assertThat(service.request.pregunta()).isEqualTo("¿Qué es la fuerza?");
    }

    @Test
    void rejectsMalformedRequestBeforeService() throws Exception {
        mockMvc.perform(post("/api/tutor-ia/connor/chat")
                        .header("X-User-Id", "12")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"pregunta\":\"\",\"contextoReciente\":[]}"))
                .andExpect(status().isBadRequest());

        assertThat(service.request).isNull();
    }

    @Test
    void returnsUnauthorizedWhenServiceRejectsMissingUser() throws Exception {
        service.failure = new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debe autenticarse");

        mockMvc.perform(post("/api/tutor-ia/connor/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"pregunta\":\"¿Qué es la fuerza?\",\"contextoReciente\":[]}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void controllerDependsOnlyOnChatService() {
        var fieldTypes = Arrays.stream(ConnorChatController.class.getDeclaredFields())
                .map(field -> field.getType())
                .toList();

        assertThat(fieldTypes).hasSize(1);
        assertThat(fieldTypes.get(0)).isEqualTo(ConnorChatService.class);
    }

    private static final class StubConnorChatService extends ConnorChatService {
        private ConnorChatResponse response;
        private ResponseStatusException failure;
        private Long userId;
        private ConnorChatRequest request;

        private StubConnorChatService() {
            super(
                    new GeminiContentClient("", "test-model", 100, 100),
                    new RoleAuthorizationService(null, null, null, null)
            );
        }

        @Override
        public ConnorChatResponse chat(Long userId, ConnorChatRequest request) {
            this.userId = userId;
            this.request = request;
            if (failure != null) {
                throw failure;
            }
            return response;
        }
    }
}
