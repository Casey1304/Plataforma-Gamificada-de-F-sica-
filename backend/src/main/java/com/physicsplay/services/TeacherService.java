package com.physicsplay.services;

import com.physicsplay.models.Classroom;
import com.physicsplay.models.ClassroomEnrollment;
import com.physicsplay.models.Student;
import com.physicsplay.models.TeacherProfile;
import com.physicsplay.models.dto.AiInsightResponse;
import com.physicsplay.models.dto.ClassroomResponse;
import com.physicsplay.models.dto.CrearAulaRequest;
import com.physicsplay.models.dto.EstudianteDetalleSupervisionResponse;
import com.physicsplay.models.dto.EstudianteSupervisionResponse;
import com.physicsplay.repositories.ClassroomEnrollmentRepository;
import com.physicsplay.repositories.ClassroomRepository;
import com.physicsplay.repositories.StudentRepository;
import com.physicsplay.repositories.TeacherProfileRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TeacherService {
    private final RoleAuthorizationService authorizationService;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassroomRepository classroomRepository;
    private final ClassroomEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ProgressService progressService;
    private final JdbcTemplate jdbcTemplate;

    public TeacherService(
            RoleAuthorizationService authorizationService,
            TeacherProfileRepository teacherProfileRepository,
            ClassroomRepository classroomRepository,
            ClassroomEnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            ProgressService progressService,
            JdbcTemplate jdbcTemplate
    ) {
        this.authorizationService = authorizationService;
        this.teacherProfileRepository = teacherProfileRepository;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.progressService = progressService;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ClassroomResponse> listarAulas(Long teacherUserId) {
        TeacherProfile profile = requireTeacherProfile(teacherUserId);
        return classroomRepository.findByTeacherProfileIdOrderByNameAsc(profile.getId()).stream()
                .map(classroom -> new ClassroomResponse(
                        classroom.getId(),
                        classroom.getName(),
                        classroom.getGrade(),
                        classroom.getSectionCode(),
                        classroom.getStatus(),
                        enrollmentRepository.findByClassroomIdAndStatus(classroom.getId(), "activo").size()
                ))
                .toList();
    }

    @Transactional
    public ClassroomResponse crearAula(Long teacherUserId, CrearAulaRequest request) {
        TeacherProfile profile = requireTeacherProfile(teacherUserId);
        Classroom classroom = classroomRepository.save(new Classroom(
                profile.getId(),
                request.nombre().trim(),
                request.grado(),
                request.seccion()
        ));
        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getGrade(),
                classroom.getSectionCode(),
                classroom.getStatus(),
                0
        );
    }

    @Transactional
    public void inscribirEstudiante(Long teacherUserId, Long classroomId, Long studentId) {
        authorizationService.requireTeacherOwnsClassroom(teacherUserId, classroomId);
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado");
        }
        if (enrollmentRepository.existsByClassroomIdAndStudentId(classroomId, studentId)) {
            enrollmentRepository.findByClassroomIdAndStudentId(classroomId, studentId).ifPresent(enrollment -> {
                if (!"activo".equals(enrollment.getStatus())) {
                    jdbcTemplate.update(
                            "UPDATE classroom_enrollments SET status = 'activo' WHERE id = ?",
                            enrollment.getId()
                    );
                }
            });
            return;
        }
        enrollmentRepository.save(new ClassroomEnrollment(classroomId, studentId));
    }

    public List<EstudianteSupervisionResponse> listarEstudiantes(Long teacherUserId) {
        authorizationService.requireTeacher(teacherUserId);
        List<Long> studentIds = enrollmentRepository.findStudentIdsByTeacherUserId(teacherUserId);
        Map<Long, List<String>> aulasPorEstudiante = cargarAulasPorEstudiante(teacherUserId);
        return studentIds.stream()
                .map(studentRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(student -> construirResumen(student, aulasPorEstudiante.getOrDefault(student.getId(), List.of())))
                .toList();
    }

    public List<EstudianteSupervisionResponse> listarEstudiantesDisponibles(Long teacherUserId) {
        authorizationService.requireTeacher(teacherUserId);
        List<Long> assigned = enrollmentRepository.findStudentIdsByTeacherUserId(teacherUserId);
        return studentRepository.findAll().stream()
                .filter(student -> !assigned.contains(student.getId()))
                .map(student -> construirResumen(student, List.of()))
                .toList();
    }

    public EstudianteDetalleSupervisionResponse detalleEstudiante(Long teacherUserId, Long studentId) {
        authorizationService.requireTeacherCanAccessStudent(teacherUserId, studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
        Map<Long, List<String>> aulasPorEstudiante = cargarAulasPorEstudiante(teacherUserId);
        EstudianteSupervisionResponse resumen = construirResumen(
                student,
                aulasPorEstudiante.getOrDefault(studentId, List.of())
        );
        AiInsightResponse panelIa = progressService.getAiInsight(studentId);
        return new EstudianteDetalleSupervisionResponse(
                resumen,
                progressService.getProgress(studentId),
                progressService.getRecommendations(studentId),
                panelIa
        );
    }

    private EstudianteSupervisionResponse construirResumen(Student student, List<String> aulas) {
        AiInsightResponse insight = progressService.getAiInsight(student.getId());
        return new EstudianteSupervisionResponse(
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                student.getLevel(),
                student.getXpTotal(),
                student.getGems(),
                student.getCurrentStreak(),
                insight.performancePercent(),
                insight.weakestTopic(),
                aulas
        );
    }

    private Map<Long, List<String>> cargarAulasPorEstudiante(Long teacherUserId) {
        TeacherProfile profile = requireTeacherProfile(teacherUserId);
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("""
                SELECT ce.student_id, c.name
                FROM classroom_enrollments ce
                INNER JOIN classrooms c ON c.id = ce.classroom_id
                WHERE c.teacher_profile_id = ?
                  AND ce.status = 'activo'
                  AND c.status = 'activo'
                ORDER BY c.name
                """, profile.getId());

        Map<Long, List<String>> result = new HashMap<>();
        for (Map<String, Object> row : rows) {
            Long studentId = ((Number) row.get("student_id")).longValue();
            String classroomName = (String) row.get("name");
            result.computeIfAbsent(studentId, key -> new ArrayList<>()).add(classroomName);
        }
        return result;
    }

    private TeacherProfile requireTeacherProfile(Long teacherUserId) {
        authorizationService.requireTeacher(teacherUserId);
        return teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de profesor no encontrado"));
    }
}
