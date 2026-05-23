package com.physicsplay.repositories;

import com.physicsplay.models.ChallengeAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeAttemptRepository extends JpaRepository<ChallengeAttempt, Long> {
}
