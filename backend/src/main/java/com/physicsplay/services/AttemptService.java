package com.physicsplay.services;

import com.physicsplay.models.Challenge;
import com.physicsplay.models.ChallengeAttempt;
import com.physicsplay.models.Exercise;
import com.physicsplay.models.ExerciseAnswer;
import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.ReinforcementRecommendation;
import com.physicsplay.models.dto.AnswerFeedbackResponse;
import com.physicsplay.models.dto.CreateAttemptRequest;
import com.physicsplay.models.dto.CreateAttemptResponse;
import com.physicsplay.models.dto.SubmitAnswerRequest;
import com.physicsplay.repositories.ChallengeAttemptRepository;
import com.physicsplay.repositories.ChallengeRepository;
import com.physicsplay.repositories.ExerciseAnswerRepository;
import com.physicsplay.repositories.ExerciseRepository;
import com.physicsplay.repositories.PhysicsTopicRepository;
import com.physicsplay.repositories.ProgressByTopicRepository;
import com.physicsplay.repositories.ReinforcementRecommendationRepository;
import com.physicsplay.repositories.StudentRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AttemptService {
    private final StudentRepository studentRepository;
    private final ChallengeRepository challengeRepository;
    private final ExerciseRepository exerciseRepository;
    private final ChallengeAttemptRepository attemptRepository;
    private final ExerciseAnswerRepository answerRepository;
    private final ProgressByTopicRepository progressRepository;
    private final PhysicsTopicRepository topicRepository;
    private final ReinforcementRecommendationRepository recommendationRepository;

    public AttemptService(
            StudentRepository studentRepository,
            ChallengeRepository challengeRepository,
            ExerciseRepository exerciseRepository,
            ChallengeAttemptRepository attemptRepository,
            ExerciseAnswerRepository answerRepository,
            ProgressByTopicRepository progressRepository,
            PhysicsTopicRepository topicRepository,
            ReinforcementRecommendationRepository recommendationRepository
    ) {
        this.studentRepository = studentRepository;
        this.challengeRepository = challengeRepository;
        this.exerciseRepository = exerciseRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.progressRepository = progressRepository;
        this.topicRepository = topicRepository;
        this.recommendationRepository = recommendationRepository;
    }

    @Transactional
    public CreateAttemptResponse createAttempt(CreateAttemptRequest request) {
        if (!studentRepository.existsById(request.studentId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado");
        }
        if (!challengeRepository.existsById(request.challengeId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reto no encontrado");
        }

        ChallengeAttempt attempt = attemptRepository.save(new ChallengeAttempt(request.studentId(), request.challengeId()));
        return new CreateAttemptResponse(attempt.getId(), attempt.getStatus());
    }

    @Transactional
    public AnswerFeedbackResponse submitAnswer(Long attemptId, SubmitAnswerRequest request) {
        ChallengeAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Intento no encontrado"));
        Exercise exercise = exerciseRepository.findById(request.exerciseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ejercicio no encontrado"));

        Challenge challenge = challengeRepository.findById(attempt.getChallengeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reto no encontrado"));

        boolean correct = normalize(request.submittedAnswer()).equals(normalize(exercise.getCorrectAnswer()));
        int earnedPoints = correct ? exercise.getPoints() : 0;
        String feedback = buildFeedback(correct, exercise);

        answerRepository.save(new ExerciseAnswer(
                attempt.getId(),
                exercise.getId(),
                request.submittedAnswer(),
                correct,
                request.attemptNumber() == null ? 1 : request.attemptNumber(),
                request.responseTimeSeconds(),
                feedback
        ));

        attempt.addScore(earnedPoints);
        attemptRepository.save(attempt);

        ProgressByTopic progress = updateProgress(attempt.getStudentId(), challenge.getTopicId(), correct, request.responseTimeSeconds());
        String recommendation = correct ? null : createRecommendationIfNeeded(attempt.getStudentId(), challenge.getTopicId(), progress);

        return new AnswerFeedbackResponse(correct, feedback, attempt.getScore(), recommendation);
    }

    private ProgressByTopic updateProgress(Long studentId, Long topicId, boolean correct, Integer responseTimeSeconds) {
        ProgressByTopic progress = progressRepository.findByStudentIdAndTopicId(studentId, topicId)
                .orElseGet(() -> new ProgressByTopic(studentId, topicId));

        int previousAnswers = progress.getCorrectAnswers() + progress.getIncorrectAnswers();
        BigDecimal averageTime = calculateAverage(progress.getAverageTimeSeconds(), previousAnswers, responseTimeSeconds);
        progress.registerAnswer(correct, averageTime);
        return progressRepository.save(progress);
    }

    private BigDecimal calculateAverage(BigDecimal currentAverage, int previousAnswers, Integer responseTimeSeconds) {
        if (responseTimeSeconds == null || responseTimeSeconds <= 0) {
            return currentAverage;
        }
        if (currentAverage == null || previousAnswers == 0) {
            return BigDecimal.valueOf(responseTimeSeconds);
        }
        return currentAverage
                .multiply(BigDecimal.valueOf(previousAnswers))
                .add(BigDecimal.valueOf(responseTimeSeconds))
                .divide(BigDecimal.valueOf(previousAnswers + 1L), 2, RoundingMode.HALF_UP);
    }

    private String createRecommendationIfNeeded(Long studentId, Long topicId, ProgressByTopic progress) {
        if (progress.getIncorrectAnswers() < 3 || progress.getIncorrectAnswers() <= progress.getCorrectAnswers()) {
            return null;
        }

        PhysicsTopic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema no encontrado"));
        String activity = "Resolver 3 ejercicios guiados de " + topic.getName() + " antes de avanzar al siguiente nivel.";
        ReinforcementRecommendation recommendation = new ReinforcementRecommendation(
                studentId,
                topicId,
                "Se detectaron errores frecuentes en " + topic.getName() + ".",
                activity,
                "rules_engine"
        );
        recommendationRepository.save(recommendation);
        return activity;
    }

    private String buildFeedback(boolean correct, Exercise exercise) {
        if (correct) {
            return "Correcto. " + exercise.getExplanation();
        }
        return "Aun no. " + exercise.getExplanation();
    }

    private String normalize(String value) {
        String withoutAccents = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.trim().toLowerCase().replaceAll("\\s+", " ");
    }
}
