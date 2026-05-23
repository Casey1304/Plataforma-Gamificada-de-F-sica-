package com.physicsplay.repositories;

import com.physicsplay.models.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
}
