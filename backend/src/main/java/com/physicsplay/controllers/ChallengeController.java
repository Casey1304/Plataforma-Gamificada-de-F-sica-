package com.physicsplay.controllers;

import com.physicsplay.models.dto.ChallengeResponse;
import com.physicsplay.services.ChallengeService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {
    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public List<ChallengeResponse> listChallenges() {
        return challengeService.listChallenges();
    }

    @GetMapping("/{challengeId}")
    public ChallengeResponse getChallenge(@PathVariable Long challengeId) {
        return challengeService.getChallenge(challengeId);
    }
}
