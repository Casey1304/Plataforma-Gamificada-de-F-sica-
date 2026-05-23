package com.physicsplay.controllers;

import com.physicsplay.models.dto.ProgressResponse;
import com.physicsplay.models.dto.RecommendationResponse;
import com.physicsplay.services.ProgressService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/{studentId}")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/progress")
    public List<ProgressResponse> getProgress(@PathVariable Long studentId) {
        return progressService.getProgress(studentId);
    }

    @GetMapping("/recommendations")
    public List<RecommendationResponse> getRecommendations(@PathVariable Long studentId) {
        return progressService.getRecommendations(studentId);
    }
}
