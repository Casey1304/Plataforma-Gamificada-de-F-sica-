# Estructura del backend

Organización del backend Spring Boot adaptada al esquema por capas:
`controllers`, `models`, `services`, `database`, `integration` y configuración transversal.

El código fuente vive en Maven bajo `src/main/java/com/physicsplay/`.
Las carpetas en la raíz de `backend/` (`controllers/`, `models/`, etc.) son documentación de referencia, no contienen código Java.

## Equivalencia con el esquema general

| Esquema general | Ubicación en Spring Boot | Notas |
|-----------------|--------------------------|-------|
| `app.js` | `PhysicsPlayApplication.java` | Punto de entrada y arranque |
| `routes` | `@RequestMapping` en controllers | Spring no usa carpeta de rutas separada |
| `controllers` | `controllers/` | REST API, validación de entrada |
| `models` | `models/entity/` + `models/dto/` | Entidades JPA y contratos JSON |
| `views` | — | No aplica: API REST sin vistas server-side |
| `services` | `services/` | Reglas de negocio |
| `database` | `repositories/` + `resources/db/migration/` | JPA y migraciones Flyway |
| `integration` | `integrations/` | Clientes externos (Gemini, IA educativa) |
| — | `middleware/` | CORS, manejo global de errores |

## Árbol de carpetas

```text
backend/
|-- pom.xml
|-- ESTRUCTURA.md
|-- README.md
|-- .env.example
`-- src/
    |-- main/
    |   |-- java/com/physicsplay/
    |   |   |-- PhysicsPlayApplication.java
    |   |   |-- controllers/          # Capa HTTP (equiv. routes + controllers)
    |   |   |-- models/
    |   |   |   |-- entity/           # Entidades JPA (@Entity)
    |   |   |   `-- dto/              # Request/Response JSON
    |   |   |-- services/             # Lógica de negocio
    |   |   |-- repositories/         # Acceso a datos (capa database)
    |   |   |-- integrations/         # Servicios externos
    |   |   `-- middleware/           # Config transversal (CORS, errores)
    |   `-- resources/
    |       |-- application.yml
    |       `-- db/migration/         # Scripts Flyway
    `-- test/                         # (reservado para pruebas)
```

## Criterio de ubicación

- **controllers**: reciben HTTP, delegan en services, devuelven DTOs. No contienen lógica de negocio.
- **models/entity**: mapeo JPA a tablas PostgreSQL. Sin anotaciones de serialización JSON custom salvo las ya existentes.
- **models/dto**: contratos de la API (nombres de campos JSON). No deben renombrarse sin coordinar con el frontend.
- **services**: reglas de negocio, orquestación, validaciones de dominio.
- **repositories**: interfaces Spring Data JPA. Una responsabilidad: persistencia.
- **integrations**: llamadas a APIs externas (Gemini). Aislado del resto para facilitar mocks o cambios de proveedor.
- **middleware**: configuración cross-cutting (CORS, `@ControllerAdvice` para errores).

## Controllers y rutas actuales

| Controller | Prefijo | Responsabilidad |
|------------|---------|-----------------|
| `AuthController` | `/api/auth` | Registro, login, sesión |
| `ChallengeController` | `/api/challenges` | Listado y detalle de retos |
| `AttemptController` | `/api/attempts` | Intentos y respuestas |
| `ProgressController` | `/api/students/{studentId}` | Progreso, recomendaciones, gamificación, IA |
| `AiController` | `/api/ai` | Predicción y ejercicios personalizados |
| `RankingController` | `/api/ranking` | Ranking de estudiantes |
| `TeacherController` | `/api/teacher` | Aulas y supervisión docente |
| `AdminController` | `/api/admin` | Gestión de usuarios y estudiantes |

## Qué no conviene mover

Para no romper el frontend ni el comportamiento actual:

- Rutas (`@RequestMapping`, paths de endpoints).
- Nombres y campos de DTOs en `models/dto/`.
- Formato de `ApiErrorResponse` y respuestas de error.
- Migraciones Flyway en `db/migration/`.
- `application.yml` (puerto, datasource, CORS).
- Lógica interna de services salvo extracciones realmente necesarias.

## Cambios de paquete no aplicados (bajo riesgo / bajo beneficio)

Se mantienen los nombres de paquete actuales en lugar de renombrar masivamente:

- `repositories` → `database.repositories`: convención Spring habitual; renombrar no aporta valor funcional.
- `integrations` → `integration`: diferencia solo nominal.
- `middleware` → `config`: equivalente semántico; renombrar no mejora mantenibilidad de forma significativa.

Estos renombres solo actualizarían imports internos sin cambiar la API pública.
