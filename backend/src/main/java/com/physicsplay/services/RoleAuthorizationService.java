package com.physicsplay.services;

import com.physicsplay.models.AppUser;
import com.physicsplay.repositories.AppUserRepository;
import com.physicsplay.repositories.ClassroomEnrollmentRepository;
import com.physicsplay.repositories.ClassroomRepository;
import com.physicsplay.repositories.TeacherProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoleAuthorizationService {
    private final AppUserRepository usuarioRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassroomRepository classroomRepository;
    private final ClassroomEnrollmentRepository enrollmentRepository;

    public RoleAuthorizationService(
            AppUserRepository usuarioRepository,
            TeacherProfileRepository teacherProfileRepository,
            ClassroomRepository classroomRepository,
            ClassroomEnrollmentRepository enrollmentRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.teacherProfileRepository = teacherProfileRepository;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public AppUser requireUser(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debe enviar el encabezado X-User-Id");
        }
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no valido"));
    }

    public AppUser requireRole(Long userId, String role) {
        AppUser usuario = requireUser(userId);
        if (!role.equals(usuario.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tiene permisos para esta accion");
        }
        if (!"activo".equals(usuario.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La cuenta no esta activa");
        }
        return usuario;
    }

    public AppUser requireAdmin(Long userId) {
        return requireRole(userId, "administrador");
    }

    public AppUser requireTeacher(Long userId) {
        return requireRole(userId, "profesor");
    }

    public void requireTeacherCanAccessStudent(Long teacherUserId, Long studentId) {
        requireTeacher(teacherUserId);
        boolean assigned = enrollmentRepository.findStudentIdsByTeacherUserId(teacherUserId).contains(studentId);
        if (!assigned) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El estudiante no pertenece a sus aulas");
        }
    }

    public void requireTeacherOwnsClassroom(Long teacherUserId, Long classroomId) {
        requireTeacher(teacherUserId);
        Long teacherProfileId = teacherProfileRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de profesor no encontrado"))
                .getId();
        classroomRepository.findById(classroomId).ifPresentOrElse(
                classroom -> {
                    if (!teacherProfileId.equals(classroom.getTeacherProfileId())) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puede administrar esta aula");
                    }
                },
                () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aula no encontrada");
                }
        );
    }
}
