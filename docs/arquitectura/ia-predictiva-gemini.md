# IA Predictiva con Gemini 1.5 Flash

## Objetivo

La capa predictiva de PhysicsPlay 2.0 analiza senales conductuales del estudiante para anticipar riesgo de frustracion, abandono o persistencia de error conceptual. El resultado se usa para actualizar el panel lateral de IA y generar un reto personalizado en el panel central.

## Endpoint Principal

`POST /api/ai/predictive-analysis`

### Request

```json
{
  "estudiante": "Alex Rivera",
  "rachaErrores": 3,
  "respuestasIncorrectasConsecutivas": 3,
  "tiempoPromedioSegundos": 12,
  "temaActual": "Fuerza y Aceleracion"
}
```

### Response

```json
{
  "analytics": {
    "tiempoPromedio": "12s",
    "intentosFallidos": 3,
    "temaMasErrores": "Fuerza y Aceleracion"
  },
  "prediction": {
    "alerta": "Alta probabilidad de frustracion o abandono en el reto actual si no se refuerza la teoria.",
    "tendencia": "Riesgo critico de persistencia de error por respuesta impulsiva y confusion conceptual."
  },
  "aiRecommendation": [
    "Revisar la teoria base de Fuerza y Aceleracion antes de otro intento.",
    "Resolver un ejercicio guiado con sustitucion paso a paso.",
    "Comparar la respuesta con unidades fisicas para detectar errores conceptuales."
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

## Componentes Backend

- `AiController`: expone `/api/ai/predictive-analysis`.
- `PredictiveAnalysisService`: recibe el DTO y delega la prediccion.
- `GeminiPredictiveAiClient`: construye el prompt, llama a Gemini 1.5 Flash y parsea JSON estricto.
- `PredictiveAnalysisRequest`: contrato de entrada.
- `PredictiveAnalysisResponse`: contrato de salida para frontend.

## Prompt Interno

El prompt indica a Gemini que actue como motor predictivo educativo y evalua:

- Nombre del alumno.
- Racha de errores.
- Respuestas incorrectas consecutivas.
- Tiempo promedio por intento.
- Tema actual.

La regla central es que una racha de fallos con respuestas muy rapidas puede indicar frustracion, abandono o persistencia del error por impulsividad.

## Configuracion

La API key queda en `backend/src/main/resources/application.yml`:

```yaml
app:
  google-ai:
    api-key: ${GOOGLE_AI_STUDIO_API_KEY:AIzaSyAYhhbRJ-TKmqnzPu-WnihcLKJe1FK43TE}
    model: ${GOOGLE_AI_MODEL:gemini-1.5-flash}
```

En despliegue se recomienda configurar `GOOGLE_AI_STUDIO_API_KEY` como variable de entorno para no depender del valor por defecto.

## Fallback

Si Gemini no responde, el JSON viene mal formado o falta la API key, `GeminiPredictiveAiClient` devuelve una prediccion local estructurada. Esto evita que el frontend rompa el flujo del usuario.

## Integracion Frontend

El boton "Generar ejercicios personalizados" llama a `requestPredictiveAnalysis()` en `frontend/web-app/src/api.js`. Con la respuesta:

- Actualiza analiticas del panel IA.
- Muestra `prediction.alerta` y `prediction.tendencia`.
- Reemplaza las sugerencias por `aiRecommendation`.
- Crea un nuevo reto usando `nextCustomChallenge`.
- Extrae masa y aceleracion desde la pregunta para mostrar el bloque y vector correctos.
