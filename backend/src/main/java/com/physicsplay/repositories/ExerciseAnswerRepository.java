package com.physicsplay.repositories;

import com.physicsplay.models.ExerciseAnswer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExerciseAnswerRepository extends JpaRepository<ExerciseAnswer, Long> {
    long countByAttemptId(Long attemptId);

    long countByAttemptIdAndCorrect(Long attemptId, Boolean correct);

    @Query("""
            SELECT COUNT(ea) FROM ExerciseAnswer ea
            INNER JOIN ChallengeAttempt ca ON ea.attemptId = ca.id
            WHERE ca.studentId = :studentId
            """)
    long countByStudentId(@Param("studentId") Long studentId);

    @Query("""
            SELECT COUNT(ea) FROM ExerciseAnswer ea
            INNER JOIN ChallengeAttempt ca ON ea.attemptId = ca.id
            WHERE ca.studentId = :studentId AND ea.correct = false
            """)
    long countIncorrectByStudentId(@Param("studentId") Long studentId);

    @Query("""
            SELECT AVG(ea.responseTimeSeconds) FROM ExerciseAnswer ea
            INNER JOIN ChallengeAttempt ca ON ea.attemptId = ca.id
            WHERE ca.studentId = :studentId AND ea.responseTimeSeconds IS NOT NULL
            """)
    Double averageResponseTimeByStudentId(@Param("studentId") Long studentId);

    @Query(
            value = """
                    SELECT e.error_pattern, COUNT(*) AS total
                    FROM exercise_answers ea
                    INNER JOIN challenge_attempts ca ON ea.attempt_id = ca.id
                    INNER JOIN exercises e ON ea.exercise_id = e.id
                    WHERE ca.student_id = :studentId
                      AND ea.is_correct = FALSE
                      AND e.error_pattern IS NOT NULL
                    GROUP BY e.error_pattern
                    ORDER BY total DESC
                    LIMIT 3
                    """,
            nativeQuery = true
    )
    List<Object[]> findTopErrorPatternsByStudentId(@Param("studentId") Long studentId);
}
