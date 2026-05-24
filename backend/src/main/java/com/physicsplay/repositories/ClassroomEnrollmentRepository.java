package com.physicsplay.repositories;

import com.physicsplay.models.ClassroomEnrollment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassroomEnrollmentRepository extends JpaRepository<ClassroomEnrollment, Long> {
    boolean existsByClassroomIdAndStudentId(Long classroomId, Long studentId);

    List<ClassroomEnrollment> findByClassroomIdAndStatus(Long classroomId, String status);

    @Query(value = """
            SELECT DISTINCT s.id
            FROM students s
            INNER JOIN classroom_enrollments ce ON ce.student_id = s.id
            INNER JOIN classrooms c ON c.id = ce.classroom_id
            INNER JOIN teacher_profiles tp ON tp.id = c.teacher_profile_id
            WHERE tp.user_id = :userId
              AND ce.status = 'activo'
              AND c.status = 'activo'
            ORDER BY s.id
            """, nativeQuery = true)
    List<Long> findStudentIdsByTeacherUserId(@Param("userId") Long userId);

    Optional<ClassroomEnrollment> findByClassroomIdAndStudentId(Long classroomId, Long studentId);
}
