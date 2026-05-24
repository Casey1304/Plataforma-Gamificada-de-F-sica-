package com.physicsplay.services;

import com.physicsplay.integrations.GeminiPredictiveAiClient;
import com.physicsplay.models.dto.PredictiveAnalysisRequest;
import com.physicsplay.models.dto.PredictiveAnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class PredictiveAnalysisService {
    private final GeminiPredictiveAiClient geminiPredictiveAiClient;

    public PredictiveAnalysisService(GeminiPredictiveAiClient geminiPredictiveAiClient) {
        this.geminiPredictiveAiClient = geminiPredictiveAiClient;
    }

    public PredictiveAnalysisResponse analyze(PredictiveAnalysisRequest request) {
        return geminiPredictiveAiClient.predict(request);
    }
}
