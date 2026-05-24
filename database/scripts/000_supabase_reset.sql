-- =============================================================================
-- PhysicsPlay - Reinicio completo de esquema en Supabase
-- =============================================================================
-- ADVERTENCIA: borra TODOS los datos (usuarios, progreso, intentos, etc.).
-- Ejecutar solo en desarrollo o cuando quieras empezar desde cero.
-- Despues ejecutar 001_supabase_schema.sql
-- =============================================================================

DROP TABLE IF EXISTS student_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS exercise_answers CASCADE;
DROP TABLE IF EXISTS challenge_attempts CASCADE;
DROP TABLE IF EXISTS reinforcement_recommendations CASCADE;
DROP TABLE IF EXISTS progress_by_topic CASCADE;
DROP TABLE IF EXISTS student_learning_preferences CASCADE;
DROP TABLE IF EXISTS classroom_enrollments CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS teacher_profiles CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS password_recovery_codes CASCADE;
DROP TABLE IF EXISTS app_users CASCADE;
DROP TABLE IF EXISTS physics_topics CASCADE;

-- Tablas antiguas en espanol (scripts previos que no usaba el backend)
DROP TABLE IF EXISTS insignias_estudiante CASCADE;
DROP TABLE IF EXISTS insignias CASCADE;
DROP TABLE IF EXISTS respuestas_ejercicio CASCADE;
DROP TABLE IF EXISTS intentos_reto CASCADE;
DROP TABLE IF EXISTS recomendaciones_refuerzo CASCADE;
DROP TABLE IF EXISTS progreso_por_tema CASCADE;
DROP TABLE IF EXISTS preferencias_aprendizaje_estudiante CASCADE;
DROP TABLE IF EXISTS ejercicios CASCADE;
DROP TABLE IF EXISTS retos CASCADE;
DROP TABLE IF EXISTS matriculas_curso CASCADE;
DROP TABLE IF EXISTS cursos_fisica CASCADE;
DROP TABLE IF EXISTS temas_fisica CASCADE;
DROP TABLE IF EXISTS perfiles_administrador CASCADE;
DROP TABLE IF EXISTS perfiles_profesor CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS codigos_recuperacion_contrasena CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Historial de Flyway (si el backend ya corrio migraciones)
DROP TABLE IF EXISTS flyway_schema_history CASCADE;
