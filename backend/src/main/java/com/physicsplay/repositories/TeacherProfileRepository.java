package com.physicsplay.repositories;

import com.physicsplay.models.TeacherProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByUserId(Long userId);
}
