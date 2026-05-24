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
        Integer xpEarnedToday
) {
}
