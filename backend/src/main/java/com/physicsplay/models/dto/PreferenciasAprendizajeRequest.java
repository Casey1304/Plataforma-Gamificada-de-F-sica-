package com.physicsplay.models.dto;

public record PreferenciasAprendizajeRequest(
        String nivelConocimiento,
        String estiloAprendizaje,
        String metaAprendizaje,
        String ritmoDiario,
        String modoApoyoIa
) {
}
