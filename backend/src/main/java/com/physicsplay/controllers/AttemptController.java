package com.physicsplay.controllers;

import com.physicsplay.models.dto.AnswerFeedbackResponse;
import com.physicsplay.models.dto.CreateAttemptRequest;
import com.physicsplay.models.dto.CreateAttemptResponse;
import com.physicsplay.models.dto.SubmitAnswerRequest;
import com.physicsplay.services.AttemptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attempts")
public class AttemptController {
    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateAttemptResponse createAttempt(@Valid @RequestBody CreateAttemptRequest request) {
        return attemptService.createAttempt(request);
    }

    @PostMapping("/{attemptId}/answers")
    public AnswerFeedbackResponse submitAnswer(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAnswerRequest request
    ) {
        return attemptService.submitAnswer(attemptId, request);
    }
}
