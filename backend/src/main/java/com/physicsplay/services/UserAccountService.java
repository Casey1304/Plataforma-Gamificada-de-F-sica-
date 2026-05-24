package com.physicsplay.services;

import com.physicsplay.models.AdminProfile;
import com.physicsplay.models.AppUser;
import com.physicsplay.models.Student;
import com.physicsplay.models.TeacherProfile;
import com.physicsplay.models.dto.PreferenciasAprendizajeRequest;
import com.physicsplay.models.dto.UsuarioAutenticadoResponse;
import com.physicsplay.repositories.AdminProfileRepository;
import com.physicsplay.repositories.AppUserRepository;
import com.physicsplay.repositories.StudentRepository;
import com.physicsplay.repositories.TeacherProfileRepository;
import java.util.Locale;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserAccountService {
    private final AppUserRepository usuarioRepository;
    private final StudentRepository estudianteRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final PasswordHashService passwordHashService;
    private final JdbcTemplate jdbcTemplate;

    public UserAccountService(
            AppUserRepository usuarioRepository,
            StudentRepository estudianteRepository,
            TeacherProfileRepository teacherProfileRepository,
            AdminProfileRepository adminProfileRepository,
            PasswordHashService passwordHashService,
            JdbcTemplate jdbcTemplate
    ) {
        this.usuarioRepository = usuarioRepository;
        this.estudianteRepository = estudianteRepository;
        this.teacherProfileRepository = teacherProfileRepository;
        this.adminProfileRepository = adminProfileRepository;
        this.passwordHashService = passwordHashService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public UsuarioAutenticadoResponse crearCuenta(
            String nombreCompleto,
            String correoElectronico,
            String contrasena,
            String rol,
            PreferenciasAprendizajeRequest preferencias
    ) {
        String correo = normalizarCorreo(correoElectronico);
        if (usuarioRepository.existsByEmail(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }

        String rolNormalizado = normalizarRol(rol);
        AppUser usuario = usuarioRepository.save(new AppUser(
                nombreCompleto.trim(),
                correo,
                passwordHashService.hash(contrasena),
                rolNormalizado
        ));

        Student estudiante = null;
        if ("estudiante".equals(rolNormalizado)) {
            estudiante = estudianteRepository.save(new Student(
                    usuario.getFullName(),
                    "5to de secundaria",
                    correo,
                    usuario.getId()
            ));
            if (preferencias != null) {
                guardarPreferencias(estudiante.getId(), preferencias);
            }
        } else if ("profesor".equals(rolNormalizado)) {
            teacherProfileRepository.save(new TeacherProfile(usuario.getId(), "Fisica", null));
        } else if ("administrador".equals(rolNormalizado)) {
            adminProfileRepository.save(new AdminProfile(usuario.getId(), "general"));
        }

        return construirRespuesta(usuario, estudiante);
    }

    public UsuarioAutenticadoResponse construirRespuesta(AppUser usuario, Student estudiante) {
        return new UsuarioAutenticadoResponse(
                usuario.getId(),
                estudiante == null ? null : estudiante.getId(),
                usuario.getFullName(),
                usuario.getEmail(),
                usuario.getRole(),
                estudiante == null ? 1 : estudiante.getLevel(),
                estudiante == null ? 0 : estudiante.getXpTotal(),
                estudiante == null ? 0 : estudiante.getGems(),
                estudiante == null ? 0 : estudiante.getCurrentStreak()
        );
    }

    public String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }

    public String normalizarRol(String rol) {
        String valor = rol.trim().toLowerCase(Locale.ROOT);
        if ("docente".equals(valor)) {
            valor = "profesor";
        }
        if (!valor.matches("estudiante|profesor|administrador")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no permitido");
        }
        return valor;
    }

    public void actualizarPreferenciasPorUsuario(Long userId, PreferenciasAprendizajeRequest preferencias) {
        Student estudiante = estudianteRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de estudiante no encontrado"));
        guardarPreferencias(estudiante.getId(), preferencias);
    }

    private void guardarPreferencias(Long estudianteId, PreferenciasAprendizajeRequest preferencias) {
        PreferenciasAprendizajeRequest datos = preferencias == null
                ? new PreferenciasAprendizajeRequest(null, null, null, null, null)
                : preferencias;

        jdbcTemplate.update("""
                INSERT INTO student_learning_preferences (
                    student_id,
                    knowledge_level,
                    learning_style,
                    learning_goal,
                    daily_pace,
                    ai_support_mode
                )
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT (student_id) DO UPDATE
                SET knowledge_level = EXCLUDED.knowledge_level,
                    learning_style = EXCLUDED.learning_style,
                    learning_goal = EXCLUDED.learning_goal,
                    daily_pace = EXCLUDED.daily_pace,
                    ai_support_mode = EXCLUDED.ai_support_mode,
                    updated_at = CURRENT_TIMESTAMP
                """,
                estudianteId,
                valorOBase(datos.nivelConocimiento(), "intermedio"),
                valorOBase(datos.estiloAprendizaje(), "practico"),
                valorOBase(datos.metaAprendizaje(), "dominar"),
                valorOBase(datos.ritmoDiario(), "constante"),
                valorOBase(datos.modoApoyoIa(), "paso-a-paso")
        );
    }

    private String valorOBase(String valor, String base) {
        return valor == null || valor.isBlank() ? base : valor.trim().toLowerCase(Locale.ROOT);
    }
}
