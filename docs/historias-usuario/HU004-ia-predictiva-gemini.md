# HU004 - Analisis predictivo con Gemini 1.5 Flash

## Historia de Usuario

Como docente o estudiante, quiero que PhysicsPlay analice patrones de error, velocidad de respuesta y tema actual con Gemini 1.5 Flash para anticipar frustracion o persistencia de errores y proponer un reto de nivelacion.

## Criterios de Aceptacion

### Escenario 1: Prediccion con riesgo alto

Dado que el estudiante Alex Rivera tiene 3 respuestas incorrectas consecutivas en Fuerza y Aceleracion y responde en menos de 15 segundos, cuando el frontend envia la peticion predictiva, entonces el backend debe solicitar a Gemini una alerta de riesgo y una tendencia conductual.

### Escenario 2: JSON estricto

Dado que Gemini responde correctamente, cuando el backend recibe la respuesta, entonces debe devolver al frontend un JSON con `analytics`, `prediction`, `aiRecommendation` y `nextCustomChallenge`.

### Escenario 3: Reto personalizado

Dado que la respuesta contiene `nextCustomChallenge`, cuando el frontend actualiza el panel central, entonces debe mostrar la nueva pregunta, cuatro opciones A/B/C/D y seleccionar como correcta la respuesta entregada por la IA.

### Escenario 4: Visualizacion fisica coherente

Dado que el reto generado menciona una masa y una aceleracion, cuando se renderiza el diagrama, entonces el bloque debe mostrar la masa correspondiente y el vector debe mostrar la aceleracion correspondiente, no placeholders internos.

### Escenario 5: Configuracion de API Key

Dado que el backend inicia, cuando se carga `application.yml`, entonces debe leer `app.google-ai.api-key` desde `GOOGLE_AI_STUDIO_API_KEY` o desde el valor por defecto configurado.

### Escenario 6: Resiliencia

Dado que Gemini falla, cuando el backend captura el error, entonces debe devolver una prediccion local estructurada sin romper el contrato del frontend.
