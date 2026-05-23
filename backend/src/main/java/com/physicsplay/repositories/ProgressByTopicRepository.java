package com.physicsplay.repositories;

import com.physicsplay.models.ProgressByTopic;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressByTopicRepository extends JpaRepository<ProgressByTopic, Long> {
    Optional<ProgressByTopic> findByStudentIdAndTopicId(Long studentId, Long topicId);

    List<ProgressByTopic> findByStudentIdOrderByTopicId(Long studentId);
}
