package com.physicsplay.services;

import com.physicsplay.integrations.EducationalAiClient;
import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.dto.PredictionResponse;
import com.physicsplay.repositories.PhysicsTopicRepository;
import com.physicsplay.repositories.ProgressByTopicRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PerformancePredictionService {
    private final ProgressByTopicRepository progressRepository;
    private final PhysicsTopicRepository topicRepository;
    private final EducationalAiClient educationalAiClient;

    public PerformancePredictionService(
            ProgressByTopicRepository progressRepository,
            PhysicsTopicRepository topicRepository,
            EducationalAiClient educationalAiClient
    ) {
        this.progressRepository = progressRepository;
        this.topicRepository = topicRepository;
        this.educationalAiClient = educationalAiClient;
    }

    public PredictionResponse predict(Long studentId) {
        List<ProgressByTopic> progressItems = progressRepository.findByStudentIdOrderByTopicId(studentId);
        List<PhysicsTopic> topics = topicRepository.findAllById(
                progressItems.stream().map(ProgressByTopic::getTopicId).toList()
        );
        List<String> difficultTopics = educationalAiClient.predictDifficultTopics(progressItems, topics);

        if (difficultTopics.isEmpty()) {
            return new PredictionResponse(
                    studentId,
                    difficultTopics,
                    "El estudiante no presenta dificultades claras con los datos actuales. Continuar con retos progresivos."
            );
        }

        return new PredictionResponse(
                studentId,
                difficultTopics,
                "Reforzar " + String.join(", ", difficultTopics) + " con ejercicios guiados y retroalimentacion paso a paso."
        );
    }
}
