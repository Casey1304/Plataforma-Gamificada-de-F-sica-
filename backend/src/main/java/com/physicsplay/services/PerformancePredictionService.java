package com.physicsplay.services;

import com.physicsplay.integrations.EducationalAiClient;
import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.dto.PersonalizedExerciseResponse;
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

    public List<PersonalizedExerciseResponse> generatePersonalizedExercises(Long studentId) {
        PredictionResponse prediction = predict(studentId);
        String topic = prediction.predictedDifficultTopics().isEmpty()
                ? "Fuerza y Aceleracion"
                : prediction.predictedDifficultTopics().get(0);
        return List.of(
                new PersonalizedExerciseResponse(
                        topic,
                        "Un bloque de 6 kg acelera a 3 m/s2. ¿Que fuerza neta actua sobre el bloque?",
                        List.of("9 N", "18 N", "24 N", "36 N"),
                        "18 N",
                        "Multiplica la masa por la aceleracion: F = m x a."
                ),
                new PersonalizedExerciseResponse(
                        topic,
                        "Si una fuerza de 30 N actua sobre una masa de 10 kg, ¿cual es la aceleracion?",
                        List.of("2 m/s2", "3 m/s2", "20 m/s2", "40 m/s2"),
                        "3 m/s2",
                        "Despeja la aceleracion: a = F / m."
                )
        );
    }
}
