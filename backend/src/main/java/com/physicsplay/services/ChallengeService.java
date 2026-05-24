package com.physicsplay.services;

import com.physicsplay.models.Challenge;
import com.physicsplay.models.Exercise;
import com.physicsplay.models.dto.ChallengeResponse;
import com.physicsplay.models.dto.ExerciseResponse;
import com.physicsplay.repositories.ChallengeRepository;
import com.physicsplay.repositories.ExerciseRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final ExerciseRepository exerciseRepository;

    public ChallengeService(ChallengeRepository challengeRepository, ExerciseRepository exerciseRepository) {
        this.challengeRepository = challengeRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public List<ChallengeResponse> listChallenges() {
        return challengeRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ChallengeResponse getChallenge(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reto no encontrado"));
        return toResponse(challenge);
    }

    private ChallengeResponse toResponse(Challenge challenge) {
        List<ExerciseResponse> exercises = exerciseRepository.findByChallengeIdOrderByIdAsc(challenge.getId())
                .stream()
                .map(this::toExerciseResponse)
                .toList();

        return new ChallengeResponse(
                challenge.getId(),
                challenge.getTopicId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getLevelNumber(),
                challenge.getRewardPoints(),
                challenge.getTimeLimitSeconds(),
                exercises
        );
    }

    private ExerciseResponse toExerciseResponse(Exercise exercise) {
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getStatement(),
                exercise.getCorrectAnswer(),
                exercise.getExplanation(),
                exercise.getPoints(),
                ExerciseOptionsBuilder.build(exercise.getCorrectAnswer()),
                ExerciseOptionsBuilder.inferVisualType(exercise.getCorrectAnswer())
        );
    }
}
