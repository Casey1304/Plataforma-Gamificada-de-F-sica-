# Arquitectura en capas - HU007

## Enfoque general

La solucion se organiza usando una arquitectura por capas inspirada en MVC, con React en el frontend, Spring Boot en el backend y Supabase PostgreSQL como base de datos. Esta estructura separa interfaz, controladores, servicios, repositorios, persistencia e integraciones para escalar PhysicsPlay sin mezclar la experiencia gamificada con la logica academica o el almacenamiento de datos.

## Capas y responsabilidades

| Capa | Responsabilidad en PhysicsPlay |
| --- | --- |
| Frontend web | Permite seleccionar retos, responder ejercicios y visualizar feedback, puntaje y progreso. |
| Frontend mobile | Adaptacion futura para dispositivos moviles. |
| Controllers | Reciben solicitudes HTTP del frontend y devuelven respuestas estructuradas. |
| Services | Aplican reglas de negocio: validacion, puntaje, progreso, deteccion de dificultades y recomendaciones. |
| Repositories | Usan Spring Data JPA para consultar y persistir estudiantes, retos, ejercicios, intentos y progreso. |
| Models | Representan entidades del dominio educativo y gamificado. |
| Middleware | Gestiona autenticacion, roles, validaciones y errores. |
| Integrations | Conecta con IA educativa o servicios externos futuros. |
| Database | Supabase PostgreSQL guarda informacion academica, intentos, respuestas, progreso e insignias. |
| Tests | Valida los criterios Given-When-Then de HU007. |

## Flujo funcional de HU007

1. El estudiante ingresa a la web app.
2. El frontend solicita retos disponibles al backend.
3. El controlador de retos consulta el servicio correspondiente.
4. El servicio obtiene ejercicios desde el repositorio.
5. El estudiante envia respuestas.
6. El backend valida respuestas, calcula puntaje y registra intentos.
7. El sistema actualiza el progreso por tema.
8. Si hay errores frecuentes, el servicio de deteccion genera una recomendacion.
9. La integracion de IA educativa analiza el historial y predice temas de dificultad probable.
10. El frontend muestra feedback, progreso y actividades sugeridas.

## Endpoints candidatos

| Metodo | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/challenges` | Listar retos disponibles. |
| `GET` | `/api/challenges/{id}` | Obtener detalle de reto y ejercicios. |
| `POST` | `/api/attempts` | Crear intento de resolucion. |
| `POST` | `/api/attempts/{id}/answers` | Registrar respuesta de un ejercicio. |
| `GET` | `/api/students/{id}/progress` | Consultar progreso del estudiante. |
| `GET` | `/api/students/{id}/recommendations` | Consultar recomendaciones de refuerzo. |
| `POST` | `/api/ai/performance-prediction` | Simular prediccion de dificultad academica. |

## Consideraciones de seguridad

- El estudiante solo puede consultar su propio progreso.
- El docente puede visualizar progreso agregado de sus estudiantes.
- Las respuestas e intentos deben validarse antes de almacenarse.
- Los datos academicos deben almacenarse sin exponer informacion sensible innecesaria.

## Integracion con IA

Para la PoC, la IA puede simularse con reglas:

- Muchos intentos incorrectos en el mismo tema indican dificultad.
- Tiempo de resolucion alto puede sugerir baja comprension.
- Errores repetidos con el mismo patron indican una brecha conceptual.

En una version posterior, estas reglas pueden evolucionar hacia un modelo predictivo entrenado con historiales de intentos, tiempos, puntajes y progreso academico.
