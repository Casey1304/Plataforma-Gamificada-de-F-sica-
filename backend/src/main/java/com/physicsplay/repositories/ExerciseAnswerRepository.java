package com.physicsplay.repositories;

import com.physicsplay.models.ExerciseAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseAnswerRepository extends JpaRepository<ExerciseAnswer, Long> {
    long countByAttemptId(Long attemptId);

    long countByAttemptIdAndCorrect(Long attemptId, Boolean correct);
}
