ALTER TABLE students
ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS xp_total INTEGER NOT NULL DEFAULT 1250,
ADD COLUMN IF NOT EXISTS gems INTEGER NOT NULL DEFAULT 1250,
ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS best_streak INTEGER NOT NULL DEFAULT 5;

UPDATE students
SET full_name = 'Alex Rivera',
    grade = '5to de secundaria',
    email = 'alex.rivera@physicsplay.local',
    level = 15,
    xp_total = 1250,
    gems = 1250,
    current_streak = 2,
    best_streak = 5
WHERE id = 1;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Reto: Leyes de Newton', 'Pregunta 2 de 5 sobre segunda ley de Newton.', 15, 50, 120
FROM physics_topics WHERE name = 'Leyes de Newton'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Un cuerpo de 10 kg acelera a 2 m/s2. ¿Cual es la fuerza aplicada?',
       '20 N',
       'F = m x a = 10 kg x 2 m/s2 = 20 N.',
       'calculo_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Reto: Leyes de Newton'
ON CONFLICT DO NOTHING;

INSERT INTO progress_by_topic (
    student_id,
    topic_id,
    completed_challenges,
    correct_answers,
    incorrect_answers,
    average_time_seconds,
    mastery_level
)
SELECT 1, id, 8, 8, 2, 80.00, 'en_progreso'
FROM physics_topics
WHERE name = 'Leyes de Newton'
ON CONFLICT (student_id, topic_id) DO UPDATE
SET completed_challenges = EXCLUDED.completed_challenges,
    correct_answers = EXCLUDED.correct_answers,
    incorrect_answers = EXCLUDED.incorrect_answers,
    average_time_seconds = EXCLUDED.average_time_seconds,
    mastery_level = EXCLUDED.mastery_level;
