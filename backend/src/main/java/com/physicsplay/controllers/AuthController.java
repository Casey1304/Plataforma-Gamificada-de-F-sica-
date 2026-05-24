package com.physicsplay.controllers;

import com.physicsplay.models.dto.InicioSesionRequest;
import com.physicsplay.models.dto.PreferenciasAprendizajeRequest;
import com.physicsplay.models.dto.RegistroEstudianteRequest;
import com.physicsplay.models.dto.UsuarioAutenticadoResponse;
import com.physicsplay.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacion", description = "Registro publico de estudiantes e inicio de sesion por correo.")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registra un estudiante", description = "Registro publico. Solo crea cuentas con rol estudiante.")
    public UsuarioAutenticadoResponse registrar(@Valid @RequestBody RegistroEstudianteRequest request) {
        return authService.registrar(request);
    }

    @PutMapping("/preferencias")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Guarda preferencias de aprendizaje", description = "Actualiza el onboarding del estudiante autenticado.")
    public void guardarPreferencias(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody PreferenciasAprendizajeRequest request
    ) {
        authService.actualizarPreferencias(userId, request);
    }

    @PostMapping("/login")
    @Operation(summary = "Inicia sesion", description = "Valida credenciales y devuelve los datos principales del perfil.")
    public UsuarioAutenticadoResponse iniciarSesion(@Valid @RequestBody InicioSesionRequest request) {
        return authService.iniciarSesion(request);
    }

    @GetMapping("/sesion")
    @Operation(summary = "Recupera la sesion", description = "Devuelve el perfil actual para restaurar la sesion en el cliente.")
    public UsuarioAutenticadoResponse obtenerSesion(@RequestHeader("X-User-Id") Long userId) {
        return authService.obtenerSesionActual(userId);
    }
}
