package com.physicsplay.services;

import java.text.Normalizer;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

final class ExerciseOptionsBuilder {
    private static final Map<String, List<String>> PRESET_OPTIONS = Map.ofEntries(
            Map.entry("15 n", List.of("5 N", "15 N", "20 N", "25 N")),
            Map.entry("12 n", List.of("7 N", "12 N", "18 N", "24 N")),
            Map.entry("20 n", List.of("5 N", "20 N", "50 N", "100 N")),
            Map.entry("primera ley de newton", List.of(
                    "Primera ley de Newton",
                    "Segunda ley de Newton",
                    "Tercera ley de Newton",
                    "Ley de gravitación universal"
            )),
            Map.entry("f = m * a", List.of("F = m * a", "F = m / a", "F = a / m", "F = m + a")),
            Map.entry("f = m x a", List.of("F = m × a", "F = m / a", "F = a / m", "F = m + a"))
    );

    private ExerciseOptionsBuilder() {
    }

    static List<String> build(String correctAnswer) {
        String key = normalizeKey(correctAnswer);
        List<String> preset = PRESET_OPTIONS.get(key);
        if (preset != null) {
            return preset;
        }
        if (key.endsWith(" n")) {
            return numericForceOptions(correctAnswer);
        }
        if (key.contains("ley de newton")) {
            return List.of(
                    "Primera ley de Newton",
                    "Segunda ley de Newton",
                    "Tercera ley de Newton",
                    "Ley de gravitación universal"
            );
        }
        return List.of(
                correctAnswer,
                "Segunda ley de Newton",
                "Tercera ley de Newton",
                "No aplica en este caso"
        );
    }

    static String inferVisualType(String correctAnswer) {
        String key = normalizeKey(correctAnswer);
        if (key.contains("ley de newton") || key.startsWith("f = ")) {
            return "newton_laws_concept";
        }
        return "newton_block_vector";
    }

    private static List<String> numericForceOptions(String correctAnswer) {
        try {
            int value = Integer.parseInt(correctAnswer.trim().split("\\s+")[0]);
            Set<String> options = new LinkedHashSet<>();
            options.add(correctAnswer);
            options.add((value / 2) + " N");
            options.add((value + 5) + " N");
            options.add((value * 2) + " N");
            return options.stream().limit(4).toList();
        } catch (NumberFormatException ignored) {
            return List.of("5 N", correctAnswer, "20 N", "50 N");
        }
    }

    private static String normalizeKey(String value) {
        String withoutAccents = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    }
}
