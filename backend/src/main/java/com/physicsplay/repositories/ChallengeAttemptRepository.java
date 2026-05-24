package com.physicsplay.repositories;

import com.physicsplay.models.ChallengeAttempt;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeAttemptRepository extends JpaRepository<ChallengeAttempt, Long> {
    long countByStudentId(Long studentId);

    long countByStudentIdAndStartedAtBetween(Long studentId, LocalDateTime start, LocalDateTime end);

    @Query("select coalesce(sum(a.score), 0) from ChallengeAttempt a where a.studentId = :studentId and a.startedAt between :start and :end")
    Long sumScoreByStudentToday(
            @Param("studentId") Long studentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
