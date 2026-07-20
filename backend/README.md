# Backend - Spring Boot

Contiene la logica del servidor de PhysicsPlay implementada con Spring Boot y organizada por capas.

El codigo fuente esta en `src/main/java/com/physicsplay/`. Ver [ESTRUCTURA.md](ESTRUCTURA.md) para el mapa completo de carpetas y equivalencias con el esquema general (`controllers`, `models`, `services`, `database`, `integration`).

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

En Windows PowerShell se pueden exportar variables para la terminal actual asi:

```powershell
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="your-database-password"
mvn spring-boot:run
```

Como alternativa, `application.yml` carga automaticamente un archivo local `backend/.env`, excluido
por Git. Puede crearse a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Para iniciar normalmente:

```powershell
mvn spring-boot:run
```

## Configuracion de Google Gemini

Connor y los demas servicios de IA leen su configuracion exclusivamente desde variables de entorno:

```text
PHYSICSPLAY_GOOGLE_AI_API_KEY=your-google-ai-studio-key
PHYSICSPLAY_GOOGLE_AI_MODEL=gemini-3.1-flash-lite
GOOGLE_AI_CONNECT_TIMEOUT_MS=5000
GOOGLE_AI_READ_TIMEOUT_MS=15000
```

La clave no debe almacenarse en `application.yml`, archivos JavaScript ni commits. El archivo
`.env.example` contiene solamente nombres y valores de referencia.

## Endpoints principales

- `GET /api/challenges`
- `GET /api/challenges/{challengeId}`
- `POST /api/attempts`
- `POST /api/attempts/{attemptId}/answers`
- `GET /api/students/{studentId}/progress`
- `GET /api/students/{studentId}/recommendations`
- `POST /api/ai/performance-prediction`
- `POST /api/tutor-ia/connor/chat`

El chat de Connor requiere el encabezado `X-User-Id` de una cuenta con rol `estudiante`. Ejemplo de
solicitud:

```json
{
  "pregunta": "¿Qué es la segunda ley de Newton?",
  "contextoReciente": [
    { "rol": "usuario", "contenido": "¿Qué es la fuerza?" },
    { "rol": "asistente", "contenido": "La fuerza cambia el movimiento de un cuerpo." }
  ]
}
```

La respuesta publica contiene solo `asistente`, `respuesta` y `fechaHora`. El prompt y la
configuracion del proveedor permanecen en el backend.
