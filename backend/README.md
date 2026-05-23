# Backend - Spring Boot

Contiene la logica del servidor de PhysicsPlay implementada con Spring Boot y organizada por capas.

Responsabilidades para HU007:

- Exponer endpoints para retos, ejercicios, respuestas y progreso.
- Validar respuestas del estudiante.
- Registrar intentos, tiempos, errores y puntajes.
- Actualizar el progreso academico por tema.
- Activar recomendaciones de refuerzo cuando se detecten dificultades.
- Preparar datos para analisis predictivo con IA educativa.

## Stack

- Java 17.
- Spring Boot.
- Spring Web.
- Spring Data JPA.
- PostgreSQL Driver.
- Flyway para migraciones.
- Supabase como proveedor PostgreSQL.
- OpenAPI/Swagger para documentacion de API.

## Configuracion Supabase

Copiar `backend/.env.example` y configurar:

```text
SUPABASE_DB_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
SUPABASE_DB_USER=postgres.your-project-ref
SUPABASE_DB_PASSWORD=your-database-password
```

En Windows PowerShell se pueden exportar variables asi:

```powershell
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="your-database-password"
mvn spring-boot:run
```

## Endpoints principales

- `GET /api/challenges`
- `GET /api/challenges/{challengeId}`
- `POST /api/attempts`
- `POST /api/attempts/{attemptId}/answers`
- `GET /api/students/{studentId}/progress`
- `GET /api/students/{studentId}/recommendations`
- `POST /api/ai/performance-prediction`
