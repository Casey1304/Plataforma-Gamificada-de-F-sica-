package com.physicsplay.services;

import com.physicsplay.models.AppUser;
import com.physicsplay.models.Student;
import com.physicsplay.models.dto.InicioSesionRequest;
import com.physicsplay.models.dto.PreferenciasAprendizajeRequest;
import com.physicsplay.models.dto.RegistroEstudianteRequest;
import com.physicsplay.models.dto.UsuarioAutenticadoResponse;
import com.physicsplay.repositories.AppUserRepository;
import com.physicsplay.repositories.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final AppUserRepository usuarioRepository;
    private final StudentRepository estudianteRepository;
    private final PasswordHashService passwordHashService;
    private final UserAccountService userAccountService;

    public AuthService(
            AppUserRepository usuarioRepository,
            StudentRepository estudianteRepository,
            PasswordHashService passwordHashService,
            UserAccountService userAccountService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.estudianteRepository = estudianteRepository;
        this.passwordHashService = passwordHashService;
        this.userAccountService = userAccountService;
    }

    @Transactional
    public UsuarioAutenticadoResponse registrar(RegistroEstudianteRequest request) {
        return userAccountService.crearCuenta(
                request.nombreCompleto(),
                request.correoElectronico(),
                request.contrasena(),
                "estudiante",
                null
        );
    }

    @Transactional
    public void actualizarPreferencias(Long userId, PreferenciasAprendizajeRequest preferencias) {
        AppUser usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (!"estudiante".equals(usuario.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo estudiantes pueden guardar preferencias de aprendizaje");
        }
        userAccountService.actualizarPreferenciasPorUsuario(userId, preferencias);
    }

    @Transactional
    public UsuarioAutenticadoResponse iniciarSesion(InicioSesionRequest request) {
        AppUser usuario = usuarioRepository.findByEmail(userAccountService.normalizarCorreo(request.correoElectronico()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas"));

        if (!"activo".equals(usuario.getStatus()) || !passwordHashService.matches(request.contrasena(), usuario.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        usuario.registerLogin();
        usuarioRepository.save(usuario);
        Student estudiante = estudianteRepository.findByUserId(usuario.getId()).orElse(null);
        return userAccountService.construirRespuesta(usuario, estudiante);
    }

    @Transactional(readOnly = true)
    public UsuarioAutenticadoResponse obtenerSesionActual(Long userId) {
        AppUser usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (!"activo".equals(usuario.getStatus())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta no está activa");
        }
        Student estudiante = estudianteRepository.findByUserId(usuario.getId()).orElse(null);
        return userAccountService.construirRespuesta(usuario, estudiante);
    }
}
