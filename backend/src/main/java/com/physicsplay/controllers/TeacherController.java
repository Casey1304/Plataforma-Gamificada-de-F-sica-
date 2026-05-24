package com.physicsplay.controllers;

import com.physicsplay.models.dto.ClassroomResponse;
import com.physicsplay.models.dto.CrearAulaRequest;
import com.physicsplay.models.dto.EstudianteDetalleSupervisionResponse;
import com.physicsplay.models.dto.EstudianteSupervisionResponse;
import com.physicsplay.services.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
@Tag(name = "Profesor", description = "Supervision de aulas y progreso de estudiantes.")
public class TeacherController {
    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/classrooms")
    @Operation(summary = "Lista aulas del profesor")
    public List<ClassroomResponse> listarAulas(@RequestHeader("X-User-Id") Long userId) {
        return teacherService.listarAulas(userId);
    }

    @PostMapping("/classrooms")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crea un aula")
    public ClassroomResponse crearAula(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CrearAulaRequest request
    ) {
        return teacherService.crearAula(userId, request);
    }

    @PostMapping("/classrooms/{classroomId}/students/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Inscribe un estudiante en un aula")
    public void inscribirEstudiante(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long classroomId,
            @PathVariable Long studentId
    ) {
        teacherService.inscribirEstudiante(userId, classroomId, studentId);
    }

    @GetMapping("/students")
    @Operation(summary = "Lista estudiantes asignados al profesor")
    public List<EstudianteSupervisionResponse> listarEstudiantes(@RequestHeader("X-User-Id") Long userId) {
        return teacherService.listarEstudiantes(userId);
    }

    @GetMapping("/students/available")
    @Operation(summary = "Lista estudiantes que aun no estan en sus aulas")
    public List<EstudianteSupervisionResponse> listarDisponibles(@RequestHeader("X-User-Id") Long userId) {
        return teacherService.listarEstudiantesDisponibles(userId);
    }

    @GetMapping("/students/{studentId}")
    @Operation(summary = "Detalle de progreso de un estudiante")
    public EstudianteDetalleSupervisionResponse detalleEstudiante(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long studentId
    ) {
        return teacherService.detalleEstudiante(userId, studentId);
    }
}
