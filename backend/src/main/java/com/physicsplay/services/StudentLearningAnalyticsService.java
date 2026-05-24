package com.physicsplay.services;

import com.physicsplay.integrations.EducationalAiClient;
import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.ProgressByTopic;
import com.physicsplay.models.ReinforcementRecommendation;
import com.physicsplay.models.Student;
import com.physicsplay.models.dto.AiInsightResponse;
import com.physicsplay.models.dto.StudentGamificationResponse;
import com.physicsplay.repositories.ChallengeAttemptRepository;
import com.physicsplay.repositories.ExerciseAnswerRepository;
import com.physicsplay.repositories.PhysicsTopicRepository;
import com.physicsplay.repositories.ProgressByTopicRepository;
import com.physicsplay.repositories.ReinforcementRecommendationRepository;
import com.physicsplay.repositories.StudentRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentLearningAnalyticsService {
    private static final String DATA_SOURCES =
            "Retos (intentos), respuestas a ejercicios, tiempos de resolución, progreso por tema y recomendaciones de refuerzo.";

    private final StudentRepository studentRepository;
    private final ProgressByTopicRepository progressRepository;
    private final PhysicsTopicRepository topicRepository;
    private final ChallengeAttemptRepository attemptRepository;
    private final ExerciseAnswerRepository answerRepository;
    private final ReinforcementRecommendationRepository recommendationRepository;
    private final EducationalAiClient educationalAiClient;

    public StudentLearningAnalyticsService(
            StudentRepository studentRepository,
            ProgressByTopicRepository progressRepository,
            PhysicsTopicRepository topicRepository,
            ChallengeAttemptRepository attemptRepository,
            ExerciseAnswerRepository answerRepository,
            ReinforcementRecommendationRepository recommendationRepository,
            EducationalAiClient educationalAiClient
    ) {
        this.studentRepository = studentRepository;
        this.progressRepository = progressRepository;
        this.topicRepository = topicRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.recommendationRepository = recommendationRepository;
        this.educationalAiClient = educationalAiClient;
    }

    public StudentGamificationResponse buildGamification(Long studentId) {
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

    public AiInsightResponse buildInsights(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));

        List<ProgressByTopic> progressItems = progressRepository.findByStudentIdOrderByTopicId(studentId);
        Map<Long, PhysicsTopic> topicsById = topicRepository.findAllById(
                progressItems.stream().map(ProgressByTopic::getTopicId).toList()
        ).stream().collect(Collectors.toMap(PhysicsTopic::getId, Function.identity()));

        long totalAttempts = attemptRepository.countByStudentId(studentId);
        long totalAnswers = answerRepository.countByStudentId(studentId);
        long incorrectAnswers = answerRepository.countIncorrectByStudentId(studentId);
        long correctAnswers = Math.max(0, totalAnswers - incorrectAnswers);

        BigDecimal averageTime = resolveAverageTime(studentId, progressItems);
        int failedAttempts = (int) incorrectAnswers;
        int performance = totalAnswers == 0
                ? 0
                : (int) Math.round((correctAnswers * 100.0) / totalAnswers);

        ProgressByTopic weakest = progressItems.stream()
                .max((left, right) -> Integer.compare(left.getIncorrectAnswers(), right.getIncorrectAnswers()))
                .orElse(null);

        String weakestTopic = resolveWeakestTopic(weakest, topicsById, incorrectAnswers, totalAnswers);
        List<String> errorPatterns = mapErrorPatterns(answerRepository.findTopErrorPatternsByStudentId(studentId));

        List<PhysicsTopic> topics = topicRepository.findAllById(
                progressItems.stream().map(ProgressByTopic::getTopicId).toList()
        );
        List<String> predictedDifficultTopics = educationalAiClient.predictDifficultTopics(progressItems, topics);
        if (predictedDifficultTopics.isEmpty() && weakestTopic != null && totalAnswers > 0) {
            predictedDifficultTopics = List.of(weakestTopic);
        }

        int examPassProbability = estimateExamPassProbability(performance, failedAttempts, totalAnswers, student.getCurrentStreak());
        String diagnosis = buildDiagnosis(
                totalAnswers,
                totalAttempts,
                performance,
                weakestTopic,
                predictedDifficultTopics,
                errorPatterns
        );
        String learningRoute = buildLearningRoute(predictedDifficultTopics, performance, student.getCurrentStreak());
        List<String> suggestions = buildSuggestions(
                studentId,
                predictedDifficultTopics,
                errorPatterns,
                performance,
                averageTime
        );

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
                failedAttempts,
                weakestTopic,
                Math.max(0, Math.min(100, performance)),
                diagnosis,
                suggestions,
                completedToday,
                15,
                xpToday,
                (int) totalAttempts,
                (int) totalAnswers,
                (int) correctAnswers,
                errorPatterns,
                predictedDifficultTopics,
                examPassProbability,
                learningRoute,
                DATA_SOURCES
        );
    }

    private BigDecimal resolveAverageTime(Long studentId, List<ProgressByTopic> progressItems) {
        Double answerAverage = answerRepository.averageResponseTimeByStudentId(studentId);
        if (answerAverage != null && answerAverage > 0) {
            return BigDecimal.valueOf(answerAverage).setScale(2, RoundingMode.HALF_UP);
        }

        List<BigDecimal> values = progressItems.stream()
                .map(ProgressByTopic::getAverageTimeSeconds)
                .filter(value -> value != null)
                .toList();
        if (values.isEmpty()) {
            return null;
        }
        return values.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
    }

    private String resolveWeakestTopic(
            ProgressByTopic weakest,
            Map<Long, PhysicsTopic> topicsById,
            long incorrectAnswers,
            long totalAnswers
    ) {
        if (totalAnswers == 0) {
            return "Sin datos aún";
        }
        if (weakest == null || weakest.getIncorrectAnswers() == 0) {
            return incorrectAnswers > 0 ? "Varios temas" : "Ninguno destacado";
        }
        PhysicsTopic topic = topicsById.get(weakest.getTopicId());
        return topic == null ? "Tema no identificado" : topic.getName();
    }

    private List<String> mapErrorPatterns(List<Object[]> rows) {
        if (rows == null || rows.isEmpty()) {
            return List.of();
        }
        return rows.stream()
                .map(row -> humanizeErrorPattern(String.valueOf(row[0])))
                .limit(3)
                .toList();
    }

    private String humanizeErrorPattern(String pattern) {
        if (pattern == null || pattern.isBlank()) {
            return "Patrón no clasificado";
        }
        return switch (pattern) {
            case "confusion_fuerzas_opuestas" -> "Confusión al restar fuerzas opuestas";
            case "formula_segunda_ley" -> "Errores al aplicar F = m × a";
            case "concepto_inercia" -> "Confusión con la primera ley (inercia)";
            case "calculo_segunda_ley" -> "Errores numéricos en la segunda ley";
            default -> pattern.replace('_', ' ');
        };
    }

    private int estimateExamPassProbability(int performance, long failedAttempts, long totalAnswers, Integer streak) {
        if (totalAnswers == 0) {
            return 55;
        }
        int safeStreak = streak == null ? 0 : streak;
        int penalty = (int) Math.min(25, failedAttempts * 2);
        int bonus = Math.min(12, safeStreak * 2);
        return Math.max(35, Math.min(98, performance - penalty + bonus));
    }

    private String buildDiagnosis(
            long totalAnswers,
            long totalAttempts,
            int performance,
            String weakestTopic,
            List<String> predictedDifficultTopics,
            List<String> errorPatterns
    ) {
        if (totalAnswers == 0) {
            return "Aún no hay respuestas registradas. Completa retos para activar predicciones basadas en tu actividad real.";
        }

        String topicsText = predictedDifficultTopics.isEmpty()
                ? weakestTopic
                : String.join(", ", predictedDifficultTopics);

        if (performance >= 85 && errorPatterns.isEmpty()) {
            return "Rendimiento alto (" + performance + "%). Puedes avanzar a retos más exigentes en "
                    + topicsText + ".";
        }

        StringBuilder diagnosis = new StringBuilder();
        diagnosis.append("Con ").append(totalAttempts).append(" intentos y ")
                .append(totalAnswers).append(" respuestas, tu precisión es del ")
                .append(performance).append("%. ");

        if (!predictedDifficultTopics.isEmpty()) {
            diagnosis.append("Temas con mayor riesgo: ").append(topicsText).append(". ");
        } else {
            diagnosis.append("Mayor dificultad detectada en ").append(weakestTopic).append(". ");
        }

        if (!errorPatterns.isEmpty()) {
            diagnosis.append("Patrones frecuentes: ").append(String.join("; ", errorPatterns)).append(".");
        }

        return diagnosis.toString().trim();
    }

    private String buildLearningRoute(List<String> predictedDifficultTopics, int performance, Integer streak) {
        int safeStreak = streak == null ? 0 : streak;
        if (predictedDifficultTopics.isEmpty()) {
            if (performance >= 80) {
                return "Ruta sugerida: consolidar dominio actual → retos de nivel superior → simulación de evaluación.";
            }
            return "Ruta sugerida: repaso teórico breve → práctica guiada → reto de refuerzo con retroalimentación.";
        }

        String focus = predictedDifficultTopics.get(0);
        if (performance < 60 || safeStreak == 0) {
            return "Ruta adaptativa: teoría de " + focus + " → 3 ejercicios guiados → reto corto → revisión de errores.";
        }
        return "Ruta adaptativa: refuerzo en " + focus + " → mezcla de ejercicios → evaluación diagnóstica.";
    }

    private List<String> buildSuggestions(
            Long studentId,
            List<String> predictedDifficultTopics,
            List<String> errorPatterns,
            int performance,
            BigDecimal averageTime
    ) {
        LinkedHashSet<String> suggestions = new LinkedHashSet<>();

        recommendationRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .limit(2)
                .map(ReinforcementRecommendation::getRecommendedActivity)
                .forEach(suggestions::add);

        for (String topic : predictedDifficultTopics.stream().limit(2).toList()) {
            suggestions.add("Practicar ejercicios guiados de " + topic + " antes de subir de nivel.");
        }

        for (String pattern : errorPatterns) {
            suggestions.add("Repasar: " + pattern + ".");
        }

        if (averageTime != null && averageTime.compareTo(BigDecimal.valueOf(15)) < 0 && performance < 75) {
            suggestions.add("Tómate más tiempo por ejercicio: respuestas muy rápidas suelen indicar impulsividad.");
        }

        if (performance < 70) {
            suggestions.add("Resolver un reto de refuerzo con explicación paso a paso (F = m × a).");
        } else if (performance >= 85) {
            suggestions.add("Probar la misión siguiente o generar ejercicios personalizados de mayor dificultad.");
        }

        if (suggestions.isEmpty()) {
            suggestions.add("Completa al menos 3 ejercicios para recibir recomendaciones más precisas.");
        }

        return new ArrayList<>(suggestions).stream().limit(5).toList();
    }
}
