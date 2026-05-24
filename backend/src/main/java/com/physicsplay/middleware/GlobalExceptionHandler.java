package com.physicsplay.middleware;

import com.physicsplay.models.dto.ApiErrorResponse;
import java.time.LocalDateTime;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(ResponseStatusException exception) {
        int statusCode = exception.getStatusCode().value();
        return ResponseEntity.status(statusCode).body(
                new ApiErrorResponse(LocalDateTime.now(), statusCode, exception.getReason())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Solicitud inválida");
        return ResponseEntity.badRequest().body(
                new ApiErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), message)
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(DataIntegrityViolationException exception) {
        String detail = exception.getMostSpecificCause().getMessage();
        String message = detail != null && detail.toLowerCase().contains("email")
                ? "Ya existe un usuario con ese correo electrónico"
                : "No se pudo guardar los datos. Verifica que la base de datos esté actualizada.";
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiErrorResponse(LocalDateTime.now(), HttpStatus.CONFLICT.value(), message)
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneral(Exception exception) {
        String message = exception.getMessage() == null || exception.getMessage().isBlank()
                ? "Error interno del servidor"
                : exception.getMessage();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), message)
        );
    }
}
