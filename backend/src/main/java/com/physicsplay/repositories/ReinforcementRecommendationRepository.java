package com.physicsplay.repositories;

import com.physicsplay.models.ReinforcementRecommendation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReinforcementRecommendationRepository extends JpaRepository<ReinforcementRecommendation, Long> {
    List<ReinforcementRecommendation> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
