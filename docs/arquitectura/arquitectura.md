# Arquitectura PhysicsPlay 2.0

PhysicsPlay 2.0 usa un ecosistema de cuatro piezas integradas: React en el cliente, Spring Boot como API de negocio, Supabase PostgreSQL como persistencia transaccional y Gemini 1.5 Flash como motor de analisis predictivo para IA educativa.

## Flujo General

1. El estudiante entra al panel de retos en `frontend/web-app`.
2. React consulta `GET /api/challenges`, `GET /api/students/{studentId}/gamification` y `GET /api/students/{studentId}/ai-insights`.
3. Spring Boot devuelve el reto activo, el balance de nivel/XP/gemas/racha y las metricas del panel IA.
4. Al resolver un ejercicio, React envia `POST /api/attempts/{attemptId}/answers`.
5. El backend evalua la respuesta, persiste el intento, actualiza progreso por tema, calcula precision, suma XP/gemas y recalcula racha.
6. Supabase PostgreSQL conserva estudiantes, retos, ejercicios, intentos, respuestas, progreso por tema y recomendaciones.
7. El modulo IA lateral puede solicitar analisis predictivo mediante `POST /api/ai/predictive-analysis`.
8. Spring Boot envia a Gemini 1.5 Flash las metricas conductuales del estudiante: racha de errores, respuestas incorrectas consecutivas, tiempo promedio por intento y tema actual.
9. Gemini devuelve un JSON estructurado con analiticas, alerta, tendencia, recomendaciones y un nuevo reto personalizado.
10. React usa ese JSON para actualizar el panel IA y reemplazar el reto central con el ejercicio generado predictivamente.

## Capas

### Frontend React

La aplicacion renderiza una pantalla de reto tipo dashboard:

- Barra superior con nivel, XP, gemas y perfil.
- Navegacion lateral.
- Panel central con pregunta, diagrama vectorial, opciones multiples y retroalimentacion inmediata.
- Panel derecho de IA con analiticas, alerta predictiva, tendencia, sugerencias y resumen diario.
- Barra inferior de consejo dinamico.

El frontend consume `POST /api/ai/predictive-analysis` cuando el usuario presiona "Generar ejercicios personalizados". Si el backend no responde, mantiene fallback local para que la experiencia no se bloquee.

### Backend Spring Boot

El backend organiza responsabilidades en controladores, servicios, repositorios, entidades y DTOs:

- `ChallengeController`: lista y detalla retos.
- `AttemptController`: crea intentos y recibe respuestas.
- `ProgressController`: expone progreso, gamificacion y analiticas.
- `AiController`: expone prediccion historica, ejercicios personalizados y analisis predictivo con Gemini.
- `AttemptService`: calcula correccion, XP, gemas, precision, racha y recomendaciones.
- `ProgressService`: agrega datos para dashboard y panel IA.
- `PerformancePredictionService`: conserva reglas locales de prediccion historica como respaldo y soporte complementario.
- `PredictiveAnalysisService`: orquesta el flujo predictivo recibido desde el frontend.
- `GeminiPredictiveAiClient`: conecta con Gemini 1.5 Flash usando Google AI Studio.

La API queda autodocumentada con Springdoc OpenAPI usando anotaciones `@Tag` y `@Operation` directamente en controladores. Swagger UI queda disponible en `/swagger-ui.html` cuando la aplicacion corre.

### Gemini 1.5 Flash

La integracion predictiva usa el endpoint de Google Generative Language API para `gemini-1.5-flash`. La configuracion vive en `backend/src/main/resources/application.yml`:

```yaml
app:
  google-ai:
    api-key: ${GOOGLE_AI_STUDIO_API_KEY:AIzaSyAYhhbRJ-TKmqnzPu-WnihcLKJe1FK43TE}
    model: ${GOOGLE_AI_MODEL:gemini-1.5-flash}
```

El backend solicita salida JSON estricta con `response_mime_type: application/json`. El contrato esperado es:

```json
{
  "analytics": {
    "tiempoPromedio": "12s",
    "intentosFallidos": 3,
    "temaMasErrores": "Fuerza y Aceleracion"
  },
  "prediction": {
    "alerta": "Alta probabilidad de frustracion si no se refuerza la teoria.",
    "tendencia": "Riesgo critico de persistencia de error por respuesta impulsiva."
  },
  "aiRecommendation": [
    "Revisar la teoria base.",
    "Resolver un ejercicio guiado.",
    "Comparar unidades fisicas."
  ],
  "nextCustomChallenge": {
    "pregunta": "Un bloque de 8 kg acelera a 2 m/s2. ¿Cual es la fuerza neta aplicada?",
    "opciones": {
      "A": "10 N",
      "B": "16 N",
      "C": "24 N",
      "D": "32 N"
    },
    "respuestaCorrecta": "16 N"
  }
}
```

### Supabase PostgreSQL

La conexion configurada en `backend/src/main/resources/application.yml` apunta a Supabase PostgreSQL mediante JDBC:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://db.tzolgewtynjwdbipsamt.supabase.co:5432/postgres
    username: postgres
    password: XfTkurJrItBmiYBs
app:
  supabase:
    api-key: sb_publishable_uZGr2GzAA-zkibaLFP2g8g_KbAZ8xzT
```

Las migraciones Flyway crean y evolucionan el esquema:

- `V1__init_hu007.sql`: base de estudiantes, temas, retos, ejercicios, intentos, respuestas y recomendaciones.
- `V2__physicsplay_2_gamification.sql`: columnas de nivel, XP, gemas, rachas y datos semilla v2.0 para Alex Rivera.

## Guardado de Progreso

Cada respuesta genera un registro en `exercise_answers`. Luego `AttemptService` actualiza:

- `challenge_attempts.score`: puntaje del intento.
- `students.xp_total`: XP acumulado.
- `students.gems`: gemas acumuladas.
- `students.current_streak` y `students.best_streak`: rachas.
- `progress_by_topic`: correctas, incorrectas, tiempo promedio y nivel de dominio.
- `reinforcement_recommendations`: recomendaciones cuando los errores superan el umbral.

## Analitica IA

PhysicsPlay 2.0 combina dos rutas de IA:

1. Ruta historica local: `EducationalAiClient` y `PerformancePredictionService` aplican reglas deterministicas sobre `progress_by_topic`.
2. Ruta predictiva Gemini: `GeminiPredictiveAiClient` analiza metricas enviadas por el frontend y devuelve una prediccion conductual en JSON estructurado.

La ruta predictiva permite detectar patrones como "el alumno falla 3 veces seguidas y responde en menos de 15 segundos", que puede indicar respuesta impulsiva, frustracion o abandono del reto. Si Gemini no responde o no hay API key valida, el backend devuelve un fallback estructurado para mantener estable la UI.
