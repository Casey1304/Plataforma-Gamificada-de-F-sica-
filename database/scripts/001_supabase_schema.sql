-- =============================================================================
-- PhysicsPlay - Esquema completo para Supabase (PostgreSQL)
-- =============================================================================
-- Ejecutar en una base VACIA (o despues de 000_supabase_reset.sql).
-- Nombres en ingles: coinciden con las entidades JPA del backend Spring Boot.
-- No inserta usuarios demo: registro y login desde la aplicacion.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Autenticacion y perfiles
-- -----------------------------------------------------------------------------

CREATE TABLE app_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    last_login_at TIMESTAMP,
    password_reset_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT app_users_role_check CHECK (role IN ('estudiante', 'profesor', 'administrador')),
    CONSTRAINT app_users_status_check CHECK (status IN ('activo', 'inactivo', 'bloqueado'))
);

CREATE TABLE password_recovery_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT password_recovery_codes_status_check CHECK (status IN ('activo', 'usado', 'expirado'))
);

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    grade VARCHAR(40) NOT NULL DEFAULT '5to de secundaria',
    email VARCHAR(120) UNIQUE,
    level INTEGER NOT NULL DEFAULT 1,
    xp_total INTEGER NOT NULL DEFAULT 0,
    gems INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_learning_preferences (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    knowledge_level VARCHAR(30) NOT NULL DEFAULT 'intermedio',
    learning_style VARCHAR(30) NOT NULL DEFAULT 'practico',
    learning_goal VARCHAR(40) NOT NULL DEFAULT 'dominar',
    daily_pace VARCHAR(30) NOT NULL DEFAULT 'constante',
    ai_support_mode VARCHAR(40) NOT NULL DEFAULT 'paso-a-paso',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT student_prefs_knowledge_check CHECK (knowledge_level IN ('basico', 'intermedio', 'avanzado')),
    CONSTRAINT student_prefs_style_check CHECK (learning_style IN ('visual', 'practico', 'teorico')),
    CONSTRAINT student_prefs_goal_check CHECK (learning_goal IN ('aprobar', 'dominar', 'explorar')),
    CONSTRAINT student_prefs_pace_check CHECK (daily_pace IN ('ligero', 'constante', 'intensivo')),
    CONSTRAINT student_prefs_ai_check CHECK (ai_support_mode IN ('pistas', 'paso-a-paso', 'refuerzo'))
);

CREATE TABLE teacher_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    specialty VARCHAR(120),
    institution VARCHAR(160),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    access_level VARCHAR(40) NOT NULL DEFAULT 'general',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_profiles_access_check CHECK (access_level IN ('general', 'super'))
);

CREATE TABLE classrooms (
    id BIGSERIAL PRIMARY KEY,
    teacher_profile_id BIGINT NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    grade VARCHAR(40) NOT NULL DEFAULT '5to de secundaria',
    section_code VARCHAR(40),
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT classrooms_status_check CHECK (status IN ('activo', 'inactivo', 'archivado'))
);

CREATE UNIQUE INDEX idx_classrooms_teacher_name ON classrooms(teacher_profile_id, name);

CREATE TABLE classroom_enrollments (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (classroom_id, student_id),
    CONSTRAINT classroom_enrollments_status_check CHECK (status IN ('activo', 'retirado'))
);

-- -----------------------------------------------------------------------------
-- Contenido pedagogico (retos y ejercicios)
-- -----------------------------------------------------------------------------

CREATE TABLE physics_topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    difficulty_level VARCHAR(30) NOT NULL DEFAULT 'basico'
);

CREATE TABLE challenges (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id) ON DELETE RESTRICT,
    title VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    level_number INTEGER NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 0,
    time_limit_seconds INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    error_pattern VARCHAR(120),
    points INTEGER NOT NULL DEFAULT 10
);

-- -----------------------------------------------------------------------------
-- Registro de actividad y progreso del estudiante
-- -----------------------------------------------------------------------------

CREATE TABLE challenge_attempts (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    total_time_seconds INTEGER,
    score INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
    CONSTRAINT challenge_attempts_status_check CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

CREATE TABLE exercise_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL REFERENCES challenge_attempts(id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    submitted_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    response_time_seconds INTEGER,
    feedback TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress_by_topic (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id) ON DELETE CASCADE,
    completed_challenges INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    average_time_seconds NUMERIC(10, 2),
    mastery_level VARCHAR(30) NOT NULL DEFAULT 'inicial',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, topic_id),
    CONSTRAINT progress_mastery_check CHECK (mastery_level IN ('inicial', 'en_progreso', 'requiere_refuerzo', 'avanzado'))
);

CREATE TABLE reinforcement_recommendations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES physics_topics(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    recommended_activity TEXT NOT NULL,
    source VARCHAR(40) NOT NULL DEFAULT 'rules_engine',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE badges (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE student_badges (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, badge_id)
);

-- -----------------------------------------------------------------------------
-- Indices
-- -----------------------------------------------------------------------------

CREATE INDEX idx_app_users_email ON app_users(email);
CREATE INDEX idx_app_users_role ON app_users(role);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX idx_classrooms_teacher_id ON classrooms(teacher_profile_id);
CREATE INDEX idx_enrollments_classroom_id ON classroom_enrollments(classroom_id);
CREATE INDEX idx_enrollments_student_id ON classroom_enrollments(student_id);
CREATE INDEX idx_password_recovery_user_status ON password_recovery_codes(user_id, status);
CREATE INDEX idx_password_recovery_expires_at ON password_recovery_codes(expires_at);
CREATE INDEX idx_challenges_topic_id ON challenges(topic_id);
CREATE UNIQUE INDEX idx_exercises_challenge_statement ON exercises(challenge_id, statement);
CREATE INDEX idx_challenge_attempts_student_started ON challenge_attempts(student_id, started_at DESC);
CREATE INDEX idx_exercise_answers_exercise_created ON exercise_answers(exercise_id, created_at DESC);
CREATE INDEX idx_progress_by_topic_student ON progress_by_topic(student_id);
CREATE INDEX idx_reinforcement_student ON reinforcement_recommendations(student_id);

-- -----------------------------------------------------------------------------
-- Datos iniciales de contenido (sin usuarios)
-- -----------------------------------------------------------------------------

INSERT INTO physics_topics (name, description, difficulty_level) VALUES
('Fuerza', 'Concepto de fuerza y su representacion en situaciones cotidianas.', 'basico'),
('Masa', 'Relacion entre masa, movimiento y resistencia al cambio de movimiento.', 'basico'),
('Aceleracion', 'Cambio de velocidad en funcion del tiempo.', 'intermedio'),
('Leyes de Newton', 'Aplicacion de las leyes de Newton en problemas de dinamica.', 'intermedio')
ON CONFLICT (name) DO NOTHING;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Mision 1: Fuerzas en accion', 'Practica fuerza neta en situaciones cotidianas.', 1, 120, 300
FROM physics_topics WHERE name = 'Fuerza'
ON CONFLICT (title) DO NOTHING;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Mision 2: Leyes de Newton', 'Resuelve retos sobre inercia, accion-reaccion y aceleracion.', 2, 160, 420
FROM physics_topics WHERE name = 'Leyes de Newton'
ON CONFLICT (title) DO NOTHING;

INSERT INTO challenges (topic_id, title, description, level_number, reward_points, time_limit_seconds)
SELECT id, 'Reto: Leyes de Newton', 'Ejercicios sobre segunda ley de Newton (F = m x a).', 3, 50, 120
FROM physics_topics WHERE name = 'Leyes de Newton'
ON CONFLICT (title) DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Si una caja recibe una fuerza de 20 N hacia la derecha y 5 N hacia la izquierda, cual es la fuerza neta?',
       '15 N',
       'La fuerza neta se obtiene restando fuerzas opuestas: 20 N - 5 N = 15 N.',
       'confusion_fuerzas_opuestas',
       10
FROM challenges c WHERE c.title = 'Mision 1: Fuerzas en accion'
ON CONFLICT (challenge_id, statement) DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Segun la segunda ley de Newton, que formula relaciona fuerza, masa y aceleracion?',
       'F = m * a',
       'La segunda ley establece que la fuerza neta es igual a la masa por la aceleracion.',
       'formula_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Mision 1: Fuerzas en accion'
ON CONFLICT (challenge_id, statement) DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Que ley explica que un cuerpo mantiene su estado de reposo o movimiento si no actua una fuerza neta?',
       'Primera ley de Newton',
       'La primera ley describe la inercia de los cuerpos.',
       'concepto_inercia',
       10
FROM challenges c WHERE c.title = 'Mision 2: Leyes de Newton'
ON CONFLICT (challenge_id, statement) DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Si la masa es 4 kg y la aceleracion es 3 m/s2, cual es la fuerza resultante?',
       '12 N',
       'Aplicando F = m * a, se obtiene 4 * 3 = 12 N.',
       'calculo_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Mision 2: Leyes de Newton'
ON CONFLICT (challenge_id, statement) DO NOTHING;

INSERT INTO exercises (challenge_id, statement, correct_answer, explanation, error_pattern, points)
SELECT c.id,
       'Un cuerpo de 10 kg acelera a 2 m/s2. Cual es la fuerza aplicada?',
       '20 N',
       'F = m x a = 10 kg x 2 m/s2 = 20 N.',
       'calculo_segunda_ley',
       10
FROM challenges c WHERE c.title = 'Reto: Leyes de Newton'
ON CONFLICT (challenge_id, statement) DO NOTHING;

INSERT INTO badges (name, description, points_required) VALUES
('Primer reto', 'Completo su primer reto interactivo.', 10),
('Constancia dinamica', 'Practico retos de Fisica Dinamica con regularidad.', 50),
('Dominio Newton', 'Demostro dominio inicial de las leyes de Newton.', 100)
ON CONFLICT (name) DO NOTHING;
