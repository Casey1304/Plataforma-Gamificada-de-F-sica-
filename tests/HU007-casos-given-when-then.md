# Casos de prueba - HU007

## Escenario 1: Resolucion correcta de ejercicios interactivos

**Given** que el estudiante ha iniciado sesion y selecciono un reto de Fisica Dinamica.  
**When** responde correctamente ejercicios sobre fuerza, masa, aceleracion o leyes de Newton.  
**Then** el sistema muestra retroalimentacion positiva, registra el puntaje y actualiza el progreso.

Validaciones:

- Se crea un intento asociado al estudiante.
- Se registra la respuesta correcta.
- Se actualiza el puntaje del reto.
- Se actualiza el progreso por tema.
- Se muestra un mensaje de feedback positivo.

## Escenario 2: Deteccion de dificultades en el aprendizaje

**Given** que el estudiante realiza varios intentos incorrectos en ejercicios del mismo tema.  
**When** el sistema detecta errores frecuentes o bajo desempeno.  
**Then** registra la dificultad y recomienda ejercicios de refuerzo relacionados.

Validaciones:

- Se registran respuestas incorrectas.
- Se identifica el tema con mayor cantidad de errores.
- Se crea una recomendacion de refuerzo.
- La recomendacion se muestra al estudiante.

## Escenario 3: Apoyo de IA mediante prediccion del desempeno

**Given** que el estudiante ha realizado multiples retos y ejercicios.  
**When** la IA analiza tiempo de resolucion, errores frecuentes, intentos y progreso.  
**Then** predice temas con dificultad probable y recomienda actividades personalizadas.

Validaciones:

- El sistema agrupa historiales por estudiante y tema.
- La IA simulada recibe datos academicos anonimizados o minimos.
- Se genera una prediccion de dificultad.
- Se retorna una actividad personalizada de refuerzo.
