package com.physicsplay.repositories;

import com.physicsplay.models.Student;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);

    Optional<Student> findByUserId(Long userId);
}
