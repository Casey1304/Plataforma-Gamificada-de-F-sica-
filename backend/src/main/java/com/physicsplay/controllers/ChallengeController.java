package com.physicsplay.controllers;

import com.physicsplay.models.dto.ChallengeResponse;
import com.physicsplay.services.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/challenges")
@Tag(name = "Retos", description = "Gestiona los retos dinamicos y ejercicios de PhysicsPlay 2.0.")
public class ChallengeController {
    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    @Operation(summary = "Lista los retos disponibles", description = "Devuelve retos con ejercicios, opciones multiples y metadatos de nivel/recompensa.")
    public List<ChallengeResponse> listChallenges() {
        return challengeService.listChallenges();
    }

    @GetMapping("/{challengeId}")
    @Operation(summary = "Obtiene un reto por id", description = "Entrega el detalle completo de un reto para renderizar la pantalla central.")
    public ChallengeResponse getChallenge(@PathVariable Long challengeId) {
        return challengeService.getChallenge(challengeId);
    }
}
