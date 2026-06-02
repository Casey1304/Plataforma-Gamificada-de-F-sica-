# Models

Representan las entidades principales de PhysicsPlay y los contratos JSON de la API.

Codigo fuente:

- Entidades JPA: `src/main/java/com/physicsplay/models/entity/`
- DTOs (request/response): `src/main/java/com/physicsplay/models/dto/`

Entidades actuales:

- `Student`, `AppUser`, `AdminProfile`, `TeacherProfile`
- `PhysicsTopic`, `Challenge`, `Exercise`, `ChallengeAttempt`, `ExerciseAnswer`
- `ProgressByTopic`, `ReinforcementRecommendation`
- `Classroom`, `ClassroomEnrollment`

Los DTOs definen los nombres de campos JSON consumidos por el frontend. No deben renombrarse sin coordinar con el cliente.
