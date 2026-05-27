package com.physicsplay.controllers;

import com.physicsplay.models.dto.StudentGamificationResponse;
import com.physicsplay.services.ProgressService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    private final ProgressService progressService;

    public RankingController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public List<StudentGamificationResponse> getRanking() {
        return progressService.getRanking();
    }
}