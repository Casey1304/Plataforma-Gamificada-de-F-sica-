package com.physicsplay.repositories;

import com.physicsplay.models.Exercise;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByChallengeIdOrderByIdAsc(Long challengeId);
}
