# HU002 - Modulo lateral de analiticas IA y ejercicios personalizados

## Historia de Usuario

Como estudiante, quiero ver un analisis lateral de mi desempeno y generar ejercicios personalizados con IA predictiva para reforzar los temas donde tengo mas errores antes de abandonar el reto.

## Criterios de Aceptacion

### Escenario 1: Visualizacion de analiticas

Dado que existen registros de progreso del estudiante, cuando se carga el panel IA, entonces debe mostrar tiempo promedio, intentos fallidos, tema con mas errores y porcentaje de desempeno general.

### Escenario 2: Recomendaciones accionables

Dado que Gemini 1.5 Flash detecta dificultad en la Segunda Ley de Newton, cuando se muestra la recomendacion, entonces debe incluir una alerta predictiva, una tendencia conductual y sugerencias checkeables de practica.

### Escenario 3: Generacion de ejercicios personalizados

Dado que el estudiante presiona "Generar ejercicios personalizados", cuando el backend recibe la peticion en `POST /api/ai/predictive-analysis`, entonces debe enviar a Gemini las metricas del estudiante y devolver `nextCustomChallenge` con pregunta, opciones A/B/C/D y respuesta correcta.

### Escenario 4: Actualizacion del reto central

Dado que Gemini devuelve un `nextCustomChallenge`, cuando el frontend recibe la respuesta, entonces debe actualizar el panel central con la pregunta generada, opciones interactivas y diagrama fisico con masa/aceleracion extraidas del enunciado.

### Escenario 5: Resumen diario

Dado que hay actividad registrada hoy, cuando el estudiante ve la parte inferior del panel IA, entonces debe mostrarse la cantidad de ejercicios completados y XP ganado en el dia.

### Escenario 6: Fallback ante error de IA

Dado que Gemini no responde o devuelve un JSON invalido, cuando el backend procesa el error, entonces debe responder con un fallback estructurado para que el frontend conserve el flujo de refuerzo.
