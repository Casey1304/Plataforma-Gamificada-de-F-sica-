-- Ejecutar en Supabase si el registro falla por columnas faltantes en app_users.
-- Seguro de ejecutar varias veces (IF NOT EXISTS).

ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'activo',
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE students
    ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES app_users(id),
    ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS xp_total INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS gems INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS best_streak INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS student_learning_preferences (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    knowledge_level VARCHAR(30) NOT NULL DEFAULT 'intermedio',
    learning_style VARCHAR(30) NOT NULL DEFAULT 'practico',
    learning_goal VARCHAR(40) NOT NULL DEFAULT 'dominar',
    daily_pace VARCHAR(30) NOT NULL DEFAULT 'constante',
    ai_support_mode VARCHAR(40) NOT NULL DEFAULT 'paso-a-paso',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
