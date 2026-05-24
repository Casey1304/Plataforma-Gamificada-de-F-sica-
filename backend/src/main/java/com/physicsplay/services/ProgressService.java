package com.physicsplay.services;

import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.ReinforcementRecommendation;
import com.physicsplay.models.Student;
import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.dto.AiInsightResponse;
import com.physicsplay.models.dto.ProgressResponse;
import com.physicsplay.models.dto.RecommendationResponse;
import com.physicsplay.models.dto.StudentGamificationResponse;
import com.physicsplay.repositories.ChallengeAttemptRepository;
import com.physicsplay.repositories.PhysicsTopicRepository;
import com.physicsplay.repositories.ProgressByTopicRepository;
import com.physicsplay.repositories.ReinforcementRecommendationRepository;
import com.physicsplay.repositories.StudentRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProgressService {
    private final ProgressByTopicRepository progressRepository;
    private final ReinforcementRecommendationRepository recommendationRepository;
    private final StudentRepository studentRepository;
    private final PhysicsTopicRepository topicRepository;
    private final ChallengeAttemptRepository attemptRepository;

    public ProgressService(
            ProgressByTopicRepository progressRepository,
            ReinforcementRecommendationRepository recommendationRepository,
            StudentRepository studentRepository,
            PhysicsTopicRepository topicRepository,
            ChallengeAttemptRepository attemptRepository
    ) {
        this.progressRepository = progressRepository;
        this.recommendationRepository = recommendationRepository;
        this.studentRepository = studentRepository;
        this.topicRepository = topicRepository;
        this.attemptRepository = attemptRepository;
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

    public StudentGamificationResponse getGamification(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
        int xpTotal = student.getXpTotal() == null ? 0 : student.getXpTotal();
        int level = student.getLevel() == null ? 1 : student.getLevel();
        int levelBaseXp = Math.max(0, (level - 3) * 100);
        return new StudentGamificationResponse(
                student.getId(),
                student.getFullName(),
                level,
                xpTotal,
                Math.max(0, xpTotal - levelBaseXp),
                100,
                student.getGems() == null ? 0 : student.getGems(),
                student.getCurrentStreak() == null ? 0 : student.getCurrentStreak(),
                student.getBestStreak() == null ? 0 : student.getBestStreak()
        );
    }

    public AiInsightResponse getAiInsight(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
        List<ProgressByTopic> progressItems = progressRepository.findByStudentIdOrderByTopicId(studentId);
        Map<Long, PhysicsTopic> topicsById = topicRepository.findAllById(
                progressItems.stream().map(ProgressByTopic::getTopicId).toList()
        ).stream().collect(Collectors.toMap(PhysicsTopic::getId, Function.identity()));

        ProgressByTopic weakest = progressItems.stream()
                .max((left, right) -> Integer.compare(left.getIncorrectAnswers(), right.getIncorrectAnswers()))
                .orElse(null);
        int correct = progressItems.stream().mapToInt(ProgressByTopic::getCorrectAnswers).sum();
        int incorrect = progressItems.stream().mapToInt(ProgressByTopic::getIncorrectAnswers).sum();
        BigDecimal averageTime = averageTime(progressItems);
        int performance = correct + incorrect == 0 ? 60 : (int) Math.round((correct * 100.0) / (correct + incorrect));
        String weakestTopic = weakest == null
                ? "Fuerza y Aceleracion"
                : topicsById.getOrDefault(weakest.getTopicId(), null) == null
                        ? "Fuerza y Aceleracion"
                        : topicsById.get(weakest.getTopicId()).getName();

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay().minusNanos(1);
        int completedToday = (int) attemptRepository.countByStudentIdAndStartedAtBetween(studentId, start, end);
        long scoreToday = attemptRepository.sumScoreByStudentToday(studentId, start, end);
        int xpToday = (int) scoreToday * 5;

        return new AiInsightResponse(
                studentId,
                student.getFullName(),
                averageTime,
                incorrect,
                weakestTopic,
                Math.max(0, Math.min(100, performance)),
                "Se detecto dificultad en la Segunda Ley de Newton (F = m x a).",
                List.of(
                        "Practicar ejercicios basicos de Fuerza.",
                        "Revisar la formula F = m x a y su aplicacion.",
                        "Resolver reto de refuerzo: Aceleracion y Fuerza."
                ),
                completedToday == 0 ? 8 : completedToday,
                15,
                xpToday == 0 ? 300 : xpToday
        );
    }

    private BigDecimal averageTime(List<ProgressByTopic> progressItems) {
        List<BigDecimal> values = progressItems.stream()
                .map(ProgressByTopic::getAverageTimeSeconds)
                .filter(value -> value != null)
                .toList();
        if (values.isEmpty()) {
            return BigDecimal.valueOf(80);
        }
        return values.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
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
