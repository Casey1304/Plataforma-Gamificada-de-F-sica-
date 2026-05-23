CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    grade VARCHAR(40) NOT NULL DEFAULT '5to de secundaria',
    email VARCHAR(120) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS physics_topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    difficulty_level VARCHAR(30) NOT NULL DEFAULT 'basico'
);

CREATE TABLE IF NOT EXISTS challenges (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id),
    title VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    level_number INTEGER NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 0,
    time_limit_seconds INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id BIGSERIAL PRIMARY KEY,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id),
    statement TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    error_pattern VARCHAR(120),
    points INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS challenge_attempts (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    challenge_id BIGINT NOT NULL REFERENCES challenges(id),
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    total_time_seconds INTEGER,
    score INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress'
);

CREATE TABLE IF NOT EXISTS exercise_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL REFERENCES challenge_attempts(id),
    exercise_id BIGINT NOT NULL REFERENCES exercises(id),
    submitted_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    response_time_seconds INTEGER,
    feedback TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_by_topic (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id),
    completed_challenges INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    average_time_seconds NUMERIC(10, 2),
    mastery_level VARCHAR(30) NOT NULL DEFAULT 'inicial',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, topic_id)
);

CREATE TABLE IF NOT EXISTS reinforcement_recommendations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id),
    reason TEXT NOT NULL,
    recommended_activity TEXT NOT NULL,
    source VARCHAR(40) NOT NULL DEFAULT 'rules_engine',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS student_badges (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    badge_id BIGINT NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, badge_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_challenge_statement
ON exercises(challenge_id, statement);

INSERT INTO students (full_name, grade, email)
VALUES ('Estudiante Demo', '5to de secundaria', 'demo@physicsplay.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO physics_topics (name, description, difficulty_level) VALUES
('Fuerza', 'Concepto de fuerza y su representacion en situaciones cotidianas.', 'basico'),
('Masa', 'Relacion entre masa, movimiento y resistencia al cambio de movimiento.', 'basico'),
('Aceleracion', 'Cambio de velocidad en funcion del tiempo.', 'intermedio'),
('Leyes de Newton', 'Aplicacion de las leyes de Newton en problemas de dinamica.', 'intermedio')
ON CONFLICT (name) DO NOTHING;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Mision 1: Fuerzas en accion', 'Practica fuerza neta en situaciones cotidianas.', 1, 120, 300
FROM physics_topics WHERE name = 'Fuerza'
ON CONFLICT DO NOTHING;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Mision 2: Leyes de Newton', 'Resuelve retos sobre inercia, accion-reaccion y aceleracion.', 2, 160, 420
FROM physics_topics WHERE name = 'Leyes de Newton'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Si una caja recibe una fuerza de 20 N hacia la derecha y 5 N hacia la izquierda, cual es la fuerza neta?',
       '15 N',
       'La fuerza neta se obtiene restando fuerzas opuestas: 20 N - 5 N = 15 N.',
       'confusion_fuerzas_opuestas',
       10
FROM challenges c WHERE c.title = 'Mision 1: Fuerzas en accion'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Segun la segunda ley de Newton, que formula relaciona fuerza, masa y aceleracion?',
       'F = m * a',
       'La segunda ley establece que la fuerza neta es igual a la masa por la aceleracion.',
       'formula_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Mision 1: Fuerzas en accion'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Que ley explica que un cuerpo mantiene su estado de reposo o movimiento si no actua una fuerza neta?',
       'Primera ley de Newton',
       'La primera ley describe la inercia de los cuerpos.',
       'concepto_inercia',
       10
FROM challenges c WHERE c.title = 'Mision 2: Leyes de Newton'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Si la masa es 4 kg y la aceleracion es 3 m/s2, cual es la fuerza resultante?',
       '12 N',
       'Aplicando F = m * a, se obtiene 4 * 3 = 12 N.',
       'calculo_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Mision 2: Leyes de Newton'
ON CONFLICT DO NOTHING;

INSERT INTO badges (name, description, points_required) VALUES
('Primer reto', 'Completo su primer reto interactivo.', 10),
('Constancia dinamica', 'Practico retos de Fisica Dinamica con regularidad.', 50),
('Dominio Newton', 'Demostro dominio inicial de las leyes de Newton.', 100)
ON CONFLICT (name) DO NOTHING;
