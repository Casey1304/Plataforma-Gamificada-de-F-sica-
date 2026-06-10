# Casos de prueba - Historias de usuario

## HU001: Registro de estudiante en la plataforma

### Escenario 1: Registro exitoso del estudiante

**Given** que el estudiante accede al formulario de registro de PhysicsPlay.  
**When** ingresa datos validos y confirma la creacion de su cuenta.  
**Then** el sistema crea el perfil del estudiante, permite el acceso a la plataforma y registra el estado inicial de aprendizaje.

Validaciones:

- Se crea una cuenta unica para el estudiante.
- Se registra el perfil inicial sin progreso academico previo.
- El sistema permite continuar hacia la configuracion inicial.
- El estudiante queda asociado a futuros intentos, puntajes y recompensas.

### Escenario 2: Validacion de datos obligatorios

**Given** que el estudiante intenta registrarse con datos incompletos, invalidos o duplicados.  
**When** envia el formulario de registro.  
**Then** el sistema muestra mensajes de validacion y evita crear una cuenta incompleta o repetida.

Validaciones:

- No se crea una cuenta cuando faltan campos obligatorios.
- No se permite registrar credenciales duplicadas.
- Se muestran mensajes claros para corregir los datos.
- El estado del sistema no queda parcialmente creado.

### Escenario 3: Preparacion de experiencia personalizada

**Given** que el estudiante completo correctamente su registro.  
**When** ingresa por primera vez a la plataforma.  
**Then** el sistema detecta que falta completar la encuesta inicial y dirige al estudiante hacia la personalizacion.

Validaciones:

- El perfil queda marcado con encuesta inicial pendiente.
- Se muestra el flujo de configuracion inicial.
- No se generan recomendaciones completas antes de completar la encuesta.
- El estudiante conserva acceso a su cuenta creada.

## HU002: Modulo lateral de analiticas IA y ejercicios personalizados

### Escenario 1: Visualizacion de analiticas

**Given** que existen registros de progreso del estudiante.  
**When** se carga el panel lateral de IA.  
**Then** el sistema muestra tiempo promedio, intentos fallidos, tema con mas errores y porcentaje de desempeno general.

Validaciones:

- Se consultan datos de progreso asociados al estudiante.
- Se calcula el tiempo promedio de respuesta.
- Se identifica el tema con mayor cantidad de errores.
- Se muestra el desempeno general sin recargar la experiencia central.

### Escenario 2: Recomendaciones accionables

**Given** que Gemini 1.5 Flash detecta dificultad en un tema de Fisica Dinamica.  
**When** el sistema muestra la recomendacion.  
**Then** debe incluir alerta predictiva, tendencia conductual y sugerencias de practica.

Validaciones:

- La alerta se relaciona con el tema detectado.
- La tendencia resume el comportamiento del estudiante.
- Las sugerencias son accionables y orientadas al refuerzo.
- El estudiante puede continuar practicando desde la recomendacion.

### Escenario 3: Generacion de ejercicios personalizados

**Given** que el estudiante presiona "Generar ejercicios personalizados".  
**When** el backend recibe la peticion en `POST /api/ai/predictive-analysis`.  
**Then** envia a Gemini las metricas del estudiante y devuelve `nextCustomChallenge` con pregunta, opciones y respuesta correcta.

Validaciones:

- La peticion incluye metricas academicas relevantes.
- La respuesta conserva el contrato esperado por el frontend.
- El reto contiene opciones A, B, C y D.
- La respuesta correcta queda identificada.

### Escenario 4: Actualizacion del reto central

**Given** que Gemini devuelve un `nextCustomChallenge`.  
**When** el frontend recibe la respuesta.  
**Then** actualiza el panel central con la pregunta generada, opciones interactivas y diagrama fisico coherente.

Validaciones:

- La pregunta generada reemplaza el reto anterior.
- Las opciones se muestran como respuestas seleccionables.
- El diagrama usa masa y aceleracion extraidas del enunciado cuando existan.
- No se muestran placeholders internos al estudiante.

### Escenario 5: Resumen diario

**Given** que hay actividad registrada durante el dia.  
**When** el estudiante ve la parte inferior del panel IA.  
**Then** se muestra la cantidad de ejercicios completados y XP ganado en el dia.

Validaciones:

- El resumen solo considera la actividad diaria.
- Se muestra el total de ejercicios completados.
- Se muestra el XP acumulado en el dia.
- Los valores son consistentes con los registros del estudiante.

### Escenario 6: Fallback ante error de IA

**Given** que Gemini no responde o devuelve un JSON invalido.  
**When** el backend procesa el error.  
**Then** responde con un fallback estructurado para conservar el flujo de refuerzo.

Validaciones:

- El backend captura el error de la integracion.
- La respuesta mantiene los campos requeridos por el frontend.
- Se muestra una recomendacion local de refuerzo.
- El estudiante puede continuar usando el modulo.

## HU003: Encuesta inicial para personalizacion del aprendizaje

### Escenario 1: Presentacion de la encuesta inicial

**Given** que el estudiante ya se registro y aun no completo la encuesta inicial.  
**When** ingresa por primera vez a PhysicsPlay.  
**Then** el sistema muestra la encuesta inicial antes de habilitar la experiencia personalizada.

Validaciones:

- Se detecta el estado de encuesta pendiente.
- Se cargan preguntas de personalizacion.
- El estudiante no recibe recomendaciones completas sin perfil inicial.
- La encuesta queda asociada al estudiante autenticado.

### Escenario 2: Registro de respuestas del estudiante

**Given** que el estudiante responde todas las preguntas obligatorias.  
**When** envia sus respuestas.  
**Then** el sistema guarda la informacion, actualiza el perfil academico inicial y marca la encuesta como completada.

Validaciones:

- Se validan todas las respuestas obligatorias.
- Las respuestas se guardan en el perfil del estudiante.
- El estado de encuesta cambia a completada.
- El sistema conserva los datos para futuras recomendaciones.

### Escenario 3: Personalizacion inicial de contenidos

**Given** que la encuesta inicial identifica dificultades o intereses especificos.  
**When** el sistema genera la vista inicial de aprendizaje.  
**Then** sugiere contenidos, temas o retos acordes con el perfil registrado.

Validaciones:

- Las recomendaciones consideran dificultades declaradas.
- Los contenidos sugeridos pertenecen a Fisica Dinamica.
- El estudiante puede acceder a los temas recomendados.
- El perfil inicial queda disponible para analiticas posteriores.

## HU004: Analisis predictivo con Gemini 1.5 Flash

### Escenario 1: Prediccion con riesgo alto

**Given** que el estudiante tiene respuestas incorrectas consecutivas en un tema y responde en poco tiempo.  
**When** el frontend envia la peticion predictiva.  
**Then** el backend solicita a Gemini una alerta de riesgo y una tendencia conductual.

Validaciones:

- La peticion incluye patron de errores y velocidad de respuesta.
- El backend invoca el servicio de IA configurado.
- La prediccion identifica el tema de riesgo.
- La tendencia describe el comportamiento detectado.

### Escenario 2: JSON estricto

**Given** que Gemini responde correctamente.  
**When** el backend recibe la respuesta.  
**Then** devuelve al frontend un JSON con `analytics`, `prediction`, `aiRecommendation` y `nextCustomChallenge`.

Validaciones:

- La respuesta contiene todos los campos requeridos.
- El formato puede ser consumido por el frontend.
- No se exponen datos innecesarios del estudiante.
- El contrato se mantiene aunque cambie el contenido generado.

### Escenario 3: Reto personalizado

**Given** que la respuesta contiene `nextCustomChallenge`.  
**When** el frontend actualiza el panel central.  
**Then** muestra la nueva pregunta, cuatro opciones y la respuesta correcta entregada por la IA.

Validaciones:

- El reto personalizado se muestra sin errores de formato.
- Existen cuatro opciones A, B, C y D.
- La respuesta correcta coincide con el valor entregado por la IA.
- El estudiante puede resolver el nuevo reto.

### Escenario 4: Visualizacion fisica coherente

**Given** que el reto generado menciona masa y aceleracion.  
**When** se renderiza el diagrama.  
**Then** el bloque muestra la masa correspondiente y el vector muestra la aceleracion correspondiente.

Validaciones:

- Se extraen valores fisicos del enunciado cuando estan disponibles.
- El diagrama refleja los datos del reto.
- No se muestran valores internos de demostracion.
- La visualizacion conserva coherencia con el contenido de dinamica.

### Escenario 5: Configuracion de API Key

**Given** que el backend inicia.  
**When** se carga la configuracion de la aplicacion.  
**Then** lee `app.google-ai.api-key` desde `GOOGLE_AI_STUDIO_API_KEY` o desde el valor por defecto configurado.

Validaciones:

- La variable de entorno puede alimentar la configuracion.
- El backend no bloquea el inicio si existe un valor valido.
- La clave no se expone en respuestas al frontend.
- La integracion queda disponible para solicitudes predictivas.

### Escenario 6: Resiliencia

**Given** que Gemini falla o devuelve una respuesta no procesable.  
**When** el backend captura el error.  
**Then** devuelve una prediccion local estructurada sin romper el contrato del frontend.

Validaciones:

- El error externo queda controlado.
- La respuesta conserva los campos esperados.
- Se genera una recomendacion local de refuerzo.
- El estudiante no pierde continuidad en la experiencia.

## HU005: Estudio de fuerza, masa, aceleracion y leyes de Newton

### Escenario 1: Acceso a contenidos de Fisica Dinamica

**Given** que el estudiante ha iniciado sesion en la plataforma.  
**When** selecciona el modulo de estudio de Fisica Dinamica.  
**Then** el sistema muestra contenidos organizados sobre fuerza, masa, aceleracion y leyes de Newton.

Validaciones:

- Se muestran temas de Fisica Dinamica.
- Los contenidos estan organizados por concepto.
- El estudiante puede abrir explicaciones y ejemplos.
- El avance del contenido queda disponible para seguimiento.

### Escenario 2: Verificacion de comprension por tema

**Given** que el estudiante revisa un contenido teorico o ejemplo guiado.  
**When** responde una pregunta de verificacion rapida.  
**Then** el sistema registra su respuesta, muestra retroalimentacion inmediata y actualiza el avance del tema.

Validaciones:

- Se registra la respuesta de verificacion.
- Se identifica si la respuesta fue correcta o incorrecta.
- Se muestra feedback inmediato.
- El avance del estudiante se actualiza por tema.

### Escenario 3: Recomendacion de refuerzo conceptual

**Given** que el estudiante presenta errores repetidos en preguntas de un mismo concepto.  
**When** el sistema detecta dificultades en fuerza, masa, aceleracion o leyes de Newton.  
**Then** sugiere explicaciones, ejemplos o actividades de refuerzo antes de continuar con retos mas complejos.

Validaciones:

- Se contabilizan errores por concepto.
- Se identifica el concepto con dificultad.
- Se muestra una recomendacion de refuerzo.
- El sistema conserva el historial para futuras recomendaciones.

## HU007: Resolucion de retos y ejercicios interactivos

### Escenario 1: Resolucion correcta de ejercicios interactivos

**Given** que el estudiante ha iniciado sesion y selecciono un reto de Fisica Dinamica.  
**When** responde correctamente ejercicios sobre fuerza, masa, aceleracion o leyes de Newton.  
**Then** el sistema muestra retroalimentacion positiva, registra el puntaje y actualiza el progreso.

Validaciones:

- Se crea un intento asociado al estudiante.
- Se registra la respuesta correcta.
- Se actualiza el puntaje del reto.
- Se actualiza el progreso por tema.
- Se muestra un mensaje de feedback positivo.

### Escenario 2: Deteccion de dificultades en el aprendizaje

**Given** que el estudiante realiza varios intentos incorrectos en ejercicios del mismo tema.  
**When** el sistema detecta errores frecuentes o bajo desempeno.  
**Then** registra la dificultad y recomienda ejercicios de refuerzo relacionados.

Validaciones:

- Se registran respuestas incorrectas.
- Se identifica el tema con mayor cantidad de errores.
- Se crea una recomendacion de refuerzo.
- La recomendacion se muestra al estudiante.

### Escenario 3: Apoyo de IA mediante prediccion del desempeno

**Given** que el estudiante ha realizado multiples retos y ejercicios.  
**When** la IA analiza tiempo de resolucion, errores frecuentes, intentos y progreso.  
**Then** predice temas con dificultad probable y recomienda actividades personalizadas.

Validaciones:

- El sistema agrupa historiales por estudiante y tema.
- La IA recibe datos academicos anonimizados o minimos.
- Se genera una prediccion de dificultad.
- Se retorna una actividad personalizada de refuerzo.
