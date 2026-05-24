package com.physicsplay.models.dto;

import java.math.BigDecimal;
import java.util.List;

public record AiInsightResponse(
        Long studentId,
        String studentName,
        BigDecimal averageTimeSeconds,
        Integer failedAttempts,
        String weakestTopic,
        Integer performancePercent,
        String diagnosis,
        List<String> suggestions,
        Integer completedExercisesToday,
        Integer dailyExerciseGoal,
        Integer xpEarnedToday,
        Integer totalAttempts,
        Integer totalAnswers,
        Integer correctAnswers,
        List<String> frequentErrorPatterns,
        List<String> predictedDifficultTopics,
        Integer examPassProbabilityPercent,
        String learningRouteSuggestion,
        String dataSourcesAnalyzed
) {
}
