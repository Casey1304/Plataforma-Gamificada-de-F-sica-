# Seleccion tecnologica

## Alternativas por capa

| Capa | Alternativas | Seleccion sugerida para la PoC |
| --- | --- | --- |
| Frontend web | React, Angular, Vue.js | React |
| Frontend mobile | React Native, Flutter | React Native en fase futura |
| Backend | Node.js/Express, Spring Boot, ASP.NET Core | Spring Boot |
| Base de datos | PostgreSQL, MySQL, MongoDB | Supabase PostgreSQL |
| Documentacion API | Swagger/OpenAPI, Postman | Swagger/OpenAPI y Postman |
| Contenedores | Docker, Podman | Docker |
| IA educativa | Servicio simulado, Python API, API externa | Servicio simulado en la PoC |
| CI/CD | GitHub Actions | GitHub Actions |

## Justificacion

React permite construir una interfaz web interactiva y responsiva para la experiencia gamificada de retos, progreso e insignias.

Spring Boot permite construir una API REST robusta, ordenada por capas y preparada para crecer con controladores, servicios, repositorios, validaciones, seguridad y documentacion OpenAPI.

Supabase con PostgreSQL es adecuado para registrar datos estructurados como estudiantes, retos, ejercicios, intentos, progreso, recomendaciones e insignias. Ademas, permite administrar la base de datos en la nube y escalar hacia autenticacion, storage o funciones si el proyecto lo requiere.

Spring Data JPA simplifica el acceso a datos, mientras que Flyway permite versionar el esquema de Supabase PostgreSQL desde el repositorio.

Swagger/OpenAPI y Postman permiten documentar y probar la API del backend durante la exposicion del prototipo.

Docker y GitHub Actions pueden incorporarse cuando el equipo avance hacia despliegue, pruebas automatizadas e integracion continua.
