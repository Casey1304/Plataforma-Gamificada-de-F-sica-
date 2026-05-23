package com.physicsplay.repositories;

import com.physicsplay.models.PhysicsTopic;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysicsTopicRepository extends JpaRepository<PhysicsTopic, Long> {
    Optional<PhysicsTopic> findByName(String name);
}
