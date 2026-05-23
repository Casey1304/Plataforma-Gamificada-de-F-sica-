package com.physicsplay.services;

import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.ReinforcementRecommendation;
import com.physicsplay.models.dto.ProgressResponse;
import com.physicsplay.models.dto.RecommendationResponse;
import com.physicsplay.repositories.ProgressByTopicRepository;
import com.physicsplay.repositories.ReinforcementRecommendationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProgressService {
    private final ProgressByTopicRepository progressRepository;
    private final ReinforcementRecommendationRepository recommendationRepository;

    public ProgressService(
            ProgressByTopicRepository progressRepository,
            ReinforcementRecommendationRepository recommendationRepository
    ) {
        this.progressRepository = progressRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public List<ProgressResponse> getProgress(Long studentId) {
        return progressRepository.findByStudentIdOrderByTopicId(studentId)
                .stream()
                .map(this::toProgressResponse)
                .toList();
    }

    public List<RecommendationResponse> getRecommendations(Long studentId) {
        return recommendationRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::toRecommendationResponse)
                .toList();
    }

    private ProgressResponse toProgressResponse(ProgressByTopic progress) {
        return new ProgressResponse(
                progress.getTopicId(),
                progress.getMasteryLevel(),
                progress.getCorrectAnswers(),
                progress.getIncorrectAnswers(),
                progress.getAverageTimeSeconds()
        );
    }

    private RecommendationResponse toRecommendationResponse(ReinforcementRecommendation recommendation) {
        return new RecommendationResponse(
                recommendation.getTopicId(),
                recommendation.getReason(),
                recommendation.getRecommendedActivity(),
                recommendation.getSource(),
                recommendation.getCreatedAt()
        );
    }
}
