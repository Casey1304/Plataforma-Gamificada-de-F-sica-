package com.physicsplay.middleware;

import com.physicsplay.models.dto.ApiErrorResponse;
import java.time.LocalDateTime;
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
                .orElse("Solicitud invalida");
        return ResponseEntity.badRequest().body(
                new ApiErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), message)
        );
    }
}
