package com.physicsplay.services;

import com.physicsplay.models.AppUser;
import com.physicsplay.models.Student;
import com.physicsplay.models.dto.ActualizarUsuarioAdminRequest;
import com.physicsplay.models.dto.AiInsightResponse;
import com.physicsplay.models.dto.CrearUsuarioAdminRequest;
import com.physicsplay.models.dto.EstudianteDetalleSupervisionResponse;
import com.physicsplay.models.dto.EstudianteSupervisionResponse;
import com.physicsplay.models.dto.UsuarioAdminResponse;
import com.physicsplay.models.dto.UsuarioAutenticadoResponse;
import com.physicsplay.repositories.AppUserRepository;
import com.physicsplay.repositories.StudentRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {
    private final RoleAuthorizationService authorizationService;
    private final AppUserRepository usuarioRepository;
    private final StudentRepository studentRepository;
    private final UserAccountService userAccountService;
    private final ProgressService progressService;

    public AdminService(
            RoleAuthorizationService authorizationService,
            AppUserRepository usuarioRepository,
            StudentRepository studentRepository,
            UserAccountService userAccountService,
            ProgressService progressService
    ) {
        this.authorizationService = authorizationService;
        this.usuarioRepository = usuarioRepository;
        this.studentRepository = studentRepository;
        this.userAccountService = userAccountService;
        this.progressService = progressService;
    }

    public List<UsuarioAdminResponse> listarUsuarios(Long adminUserId) {
        authorizationService.requireAdmin(adminUserId);
        return usuarioRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public UsuarioAutenticadoResponse crearUsuario(Long adminUserId, CrearUsuarioAdminRequest request) {
        authorizationService.requireAdmin(adminUserId);
        return userAccountService.crearCuenta(
                request.nombreCompleto(),
                request.correoElectronico(),
                request.contrasena(),
                request.rol(),
                request.preferencias()
        );
    }

    @Transactional
    public UsuarioAdminResponse actualizarUsuario(Long adminUserId, Long targetUserId, ActualizarUsuarioAdminRequest request) {
        authorizationService.requireAdmin(adminUserId);
        AppUser usuario = usuarioRepository.findById(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (request.estado() != null && !request.estado().isBlank()) {
            String estado = request.estado().trim().toLowerCase(Locale.ROOT);
            if (!estado.matches("activo|inactivo|bloqueado")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado no permitido");
            }
            usuario.cambiarEstado(estado);
        }

        if (request.rol() != null && !request.rol().isBlank()) {
            usuario.cambiarRol(userAccountService.normalizarRol(request.rol()));
        }

        return toAdminResponse(usuarioRepository.save(usuario));
    }

    public List<EstudianteSupervisionResponse> listarEstudiantes(Long adminUserId) {
        authorizationService.requireAdmin(adminUserId);
        return studentRepository.findAll().stream()
                .map(this::resumenEstudiante)
                .toList();
    }

    public EstudianteDetalleSupervisionResponse detalleEstudiante(Long adminUserId, Long studentId) {
        authorizationService.requireAdmin(adminUserId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
        EstudianteSupervisionResponse resumen = resumenEstudiante(student);
        AiInsightResponse panelIa = progressService.getAiInsight(studentId);
        return new EstudianteDetalleSupervisionResponse(
                resumen,
                progressService.getProgress(studentId),
                progressService.getRecommendations(studentId),
                panelIa
        );
    }

    private EstudianteSupervisionResponse resumenEstudiante(Student student) {
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
                List.of()
        );
    }

    private UsuarioAdminResponse toAdminResponse(AppUser usuario) {
        Long estudianteId = studentRepository.findByUserId(usuario.getId()).map(Student::getId).orElse(null);
        return new UsuarioAdminResponse(
                usuario.getId(),
                estudianteId,
                usuario.getFullName(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getStatus(),
                usuario.getLastLoginAt(),
                usuario.getCreatedAt()
        );
    }
}
