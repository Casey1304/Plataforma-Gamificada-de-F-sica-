package com.physicsplay.controllers;

import com.physicsplay.models.dto.ActualizarUsuarioAdminRequest;
import com.physicsplay.models.dto.CrearUsuarioAdminRequest;
import com.physicsplay.models.dto.EstudianteDetalleSupervisionResponse;
import com.physicsplay.models.dto.EstudianteSupervisionResponse;
import com.physicsplay.models.dto.UsuarioAdminResponse;
import com.physicsplay.models.dto.UsuarioAutenticadoResponse;
import com.physicsplay.services.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administracion", description = "Gestion de usuarios y supervision global.")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "Lista todos los usuarios")
    public List<UsuarioAdminResponse> listarUsuarios(@RequestHeader("X-User-Id") Long userId) {
        return adminService.listarUsuarios(userId);
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crea un usuario con cualquier rol")
    public UsuarioAutenticadoResponse crearUsuario(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CrearUsuarioAdminRequest request
    ) {
        return adminService.crearUsuario(userId, request);
    }

    @PatchMapping("/users/{targetUserId}")
    @Operation(summary = "Actualiza estado o rol de un usuario")
    public UsuarioAdminResponse actualizarUsuario(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long targetUserId,
            @Valid @RequestBody ActualizarUsuarioAdminRequest request
    ) {
        return adminService.actualizarUsuario(userId, targetUserId, request);
    }

    @GetMapping("/students")
    @Operation(summary = "Lista todos los estudiantes con resumen de progreso")
    public List<EstudianteSupervisionResponse> listarEstudiantes(@RequestHeader("X-User-Id") Long userId) {
        return adminService.listarEstudiantes(userId);
    }

    @GetMapping("/students/{studentId}")
    @Operation(summary = "Detalle de progreso de un estudiante")
    public EstudianteDetalleSupervisionResponse detalleEstudiante(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long studentId
    ) {
        return adminService.detalleEstudiante(userId, studentId);
    }
}
