# Scripts SQL para Supabase

Scripts para crear el esquema de PhysicsPlay en **PostgreSQL (Supabase)**. Los nombres de tablas y columnas coinciden con el backend Spring Boot (`app_users`, `students`, etc.).

## Archivos

| Archivo | Uso |
|---------|-----|
| `000_supabase_reset.sql` | Borra todas las tablas (desarrollo). **Elimina todos los datos.** |
| `001_supabase_schema.sql` | Crea el esquema completo y datos de retos/ejercicios (sin usuarios demo). |
| `002_teacher_admin_classrooms.sql` | Solo si ya tenias `001` antiguo: aulas, perfiles profesor/admin e inscripciones. |
| `003_fix_auth_columns.sql` | Si falla el registro de estudiantes: columnas de autenticacion que puedan faltar. |

## Instalacion en Supabase (recomendado)

1. Abre tu proyecto en [Supabase](https://supabase.com) → **SQL Editor**.
2. Si ya tienes tablas viejas o mezcladas, ejecuta primero `000_supabase_reset.sql`.
3. Ejecuta `001_supabase_schema.sql`.
4. Configura en el backend las variables `SUPABASE_DB_URL`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`.
5. Si vas a usar **solo** estos scripts (sin Flyway al arrancar), en `application.yml` puedes poner `spring.flyway.enabled: false` o registrar baseline (ver abajo).

## Que incluye el esquema

### Autenticacion (prioridad actual)

- `app_users` — correo, hash de contrasena (PBKDF2), rol, estado, ultimo login.
- `password_recovery_codes` — recuperacion de contrasena (futuro).
- `students` — perfil de estudiante vinculado a `app_users`.
- `student_learning_preferences` — onboarding (nivel, estilo, meta, ritmo, modo IA).
- `teacher_profiles` / `admin_profiles` — perfiles por rol.
- `classrooms` / `classroom_enrollments` — aulas del profesor e inscripcion de estudiantes a supervisar.

### Progreso y actividad

- `challenge_attempts` — cada vez que un estudiante inicia un reto.
- `exercise_answers` — respuestas enviadas (correcta/incorrecta, tiempo).
- `progress_by_topic` — dominio por tema de fisica.
- `reinforcement_recommendations` — sugerencias de refuerzo.
- `badges` / `student_badges` — insignias.

### Contenido

- `physics_topics`, `challenges`, `exercises` — retos precargados para practicar.

## Usuarios

No se insertan usuarios de prueba. Cada persona debe **registrarse** desde la app (`POST /api/auth/registro`) o iniciar sesion (`POST /api/auth/login`).

## Flyway vs script manual

El backend tambien tiene migraciones en `backend/src/main/resources/db/migration/`. Deben describir el **mismo** esquema que `001_supabase_schema.sql`.

- **Base vacia en Supabase + script manual:** desactiva Flyway o inserta baseline para no reaplicar migraciones.
- **Base vacia + solo backend:** arranca Spring Boot y Flyway aplicara `V1__physicsplay_schema.sql`.

### Baseline si ya ejecutaste el script en Supabase

```sql
CREATE TABLE IF NOT EXISTS flyway_schema_history (
    installed_rank INT NOT NULL,
    version VARCHAR(50),
    description VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    script VARCHAR(1000) NOT NULL,
    checksum INT,
    installed_by VARCHAR(100) NOT NULL,
    installed_on TIMESTAMP NOT NULL DEFAULT NOW(),
    execution_time INT NOT NULL,
    success BOOLEAN NOT NULL,
    PRIMARY KEY (installed_rank)
);

INSERT INTO flyway_schema_history (
    installed_rank, version, description, type, script,
    checksum, installed_by, execution_time, success
) VALUES (
    1, '1', 'physicsplay schema', 'SQL', 'V1__physicsplay_schema.sql',
    NULL, 'supabase-manual', 0, TRUE
);
```
