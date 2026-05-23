package com.physicsplay.integrations;

import com.physicsplay.models.PhysicsTopic;
import com.physicsplay.models.ProgressByTopic;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class EducationalAiClient {
    public List<String> predictDifficultTopics(List<ProgressByTopic> progressItems, List<PhysicsTopic> topics) {
        Map<Long, PhysicsTopic> topicsById = topics.stream()
                .collect(Collectors.toMap(PhysicsTopic::getId, Function.identity()));

        return progressItems.stream()
                .filter(this::requiresSupport)
                .map(progress -> topicsById.get(progress.getTopicId()))
                .filter(topic -> topic != null)
                .map(PhysicsTopic::getName)
                .toList();
    }

    private boolean requiresSupport(ProgressByTopic progress) {
        boolean moreErrorsThanCorrect = progress.getIncorrectAnswers() > progress.getCorrectAnswers();
        boolean slowResolution = progress.getAverageTimeSeconds() != null
                && progress.getAverageTimeSeconds().compareTo(BigDecimal.valueOf(75)) > 0;
        return moreErrorsThanCorrect || slowResolution || "requiere_refuerzo".equals(progress.getMasteryLevel());
    }
}
