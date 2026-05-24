package com.physicsplay.repositories;

import com.physicsplay.models.Classroom;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    List<Classroom> findByTeacherProfileIdOrderByNameAsc(Long teacherProfileId);
}
