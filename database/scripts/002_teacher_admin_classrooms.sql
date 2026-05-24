-- Ejecutar en Supabase si ya aplicaste una version anterior de 001 sin aulas/perfiles.
-- Instalacion nueva: 001_supabase_schema.sql ya incluye estas tablas.

CREATE TABLE IF NOT EXISTS teacher_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    specialty VARCHAR(120),
    institution VARCHAR(160),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    access_level VARCHAR(40) NOT NULL DEFAULT 'general',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_profiles_access_check CHECK (access_level IN ('general', 'super'))
);

CREATE TABLE IF NOT EXISTS classrooms (
    id BIGSERIAL PRIMARY KEY,
    teacher_profile_id BIGINT NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    grade VARCHAR(40) NOT NULL DEFAULT '5to de secundaria',
    section_code VARCHAR(40),
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT classrooms_status_check CHECK (status IN ('activo', 'inactivo', 'archivado'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_classrooms_teacher_name
ON classrooms(teacher_profile_id, name);

CREATE TABLE IF NOT EXISTS classroom_enrollments (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'activo',
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (classroom_id, student_id),
    CONSTRAINT classroom_enrollments_status_check CHECK (status IN ('activo', 'retirado'))
);

CREATE INDEX IF NOT EXISTS idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher_id ON classrooms(teacher_profile_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_classroom_id ON classroom_enrollments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON classroom_enrollments(student_id);

INSERT INTO teacher_profiles (user_id, specialty)
SELECT u.id, 'Fisica'
FROM app_users u
WHERE u.role = 'profesor'
  AND NOT EXISTS (SELECT 1 FROM teacher_profiles tp WHERE tp.user_id = u.id);

INSERT INTO admin_profiles (user_id, access_level)
SELECT u.id, 'general'
FROM app_users u
WHERE u.role = 'administrador'
  AND NOT EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.user_id = u.id);
