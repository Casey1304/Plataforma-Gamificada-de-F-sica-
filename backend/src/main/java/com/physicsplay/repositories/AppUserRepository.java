package com.physicsplay.repositories;

import com.physicsplay.models.AppUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    boolean existsByEmail(String email);

    Optional<AppUser> findByEmail(String email);

    List<AppUser> findAllByOrderByCreatedAtDesc();
}
