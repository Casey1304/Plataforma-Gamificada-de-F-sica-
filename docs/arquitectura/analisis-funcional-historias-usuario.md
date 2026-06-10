# Analisis funcional - Historias de usuario de PhysicsPlay

## Proposito

Definir los componentes funcionales minimos de la prueba de concepto para cubrir el flujo completo de aprendizaje de PhysicsPlay: registro del estudiante, personalizacion inicial, estudio de contenidos, practica mediante retos interactivos, analiticas educativas y apoyo predictivo con IA.

## Historias cubiertas

| Historia | Enfoque funcional | Resultado esperado |
| --- | --- | --- |
| HU001 | Registro de estudiante en la plataforma | El estudiante crea una cuenta y queda habilitado para acceder a contenidos personalizados. |
| HU002 | Modulo lateral de analiticas IA y ejercicios personalizados | El estudiante visualiza su desempeno y recibe ejercicios personalizados para reforzar dificultades. |
| HU003 | Encuesta inicial para personalizacion del aprendizaje | El sistema construye un perfil academico inicial a partir de respuestas del estudiante. |
| HU004 | Analisis predictivo con Gemini 1.5 Flash | El sistema anticipa dificultades, frustracion o persistencia de errores y propone un reto de nivelacion. |
| HU005 | Estudio de fuerza, masa, aceleracion y leyes de Newton | El estudiante revisa contenidos de Fisica Dinamica antes de resolver retos. |
| HU007 | Resolucion de retos y ejercicios interactivos | El estudiante practica temas aprendidos, recibe retroalimentacion y actualiza su progreso. |

## Relacion funcional entre historias

1. HU001 habilita la identidad del estudiante dentro de la plataforma.
2. HU003 personaliza la experiencia inicial a partir del perfil academico declarado.
3. HU005 entrega contenidos de Fisica Dinamica para preparar la practica.
4. HU007 permite aplicar lo aprendido mediante retos y ejercicios interactivos.
5. HU002 muestra analiticas del desempeno y activa ejercicios personalizados.
6. HU004 procesa patrones de error con Gemini 1.5 Flash para anticipar dificultades y proponer nivelacion.

## Tabla de analisis funcional

| Elemento | Descripcion |
| --- | --- |
| Actor principal | Estudiante de 5to de secundaria |
| Actor secundario | Docente que revisa progreso, dificultades y recomendaciones |
| Servicio interno | Gestion de registro y perfil del estudiante |
| Servicio interno | Motor de encuesta inicial y personalizacion |
| Servicio interno | Motor de contenidos de Fisica Dinamica |
| Servicio interno | Motor de retos, ejercicios y validacion de respuestas |
| Servicio interno | Motor de puntaje, progreso, rachas, XP, gemas e insignias |
| Servicio interno | Motor de analiticas educativas por estudiante y tema |
| Integracion externa | Gemini 1.5 Flash para prediccion de dificultades y generacion de retos personalizados |
| Funcion principal | Guiar al estudiante desde el registro hasta la practica personalizada de Fisica Dinamica |
| Funcion secundaria | Registrar respuestas, tiempos, intentos, progreso, dificultades y recomendaciones |
| Funcion secundaria | Mostrar analiticas y recomendaciones accionables para reforzar temas con bajo desempeno |
| Restriccion | Acceso autenticado, validacion de datos, trazabilidad del progreso y fallback ante fallos de IA |

## Procesos principales por historia

### HU001: Registro de estudiante

1. El estudiante accede al formulario de registro.
2. El sistema solicita datos obligatorios y credenciales.
3. El estudiante envia la informacion requerida.
4. El sistema valida datos incompletos, invalidos o duplicados.
5. El sistema crea el perfil del estudiante.
6. El sistema marca el perfil como pendiente de encuesta inicial.
7. El estudiante queda habilitado para iniciar su configuracion personalizada.

### HU003: Encuesta inicial

1. El estudiante registrado ingresa por primera vez a PhysicsPlay.
2. El sistema verifica si la encuesta inicial ya fue completada.
3. El sistema presenta preguntas sobre conocimientos previos, dificultades y preferencias.
4. El estudiante responde las preguntas obligatorias.
5. El sistema guarda las respuestas asociadas al perfil.
6. El sistema genera un perfil academico inicial.
7. El sistema sugiere contenidos o temas iniciales segun el perfil.

### HU005: Estudio de contenidos de Fisica Dinamica

1. El estudiante accede al modulo de estudio.
2. El sistema muestra contenidos sobre fuerza, masa, aceleracion y leyes de Newton.
3. El estudiante revisa explicaciones y ejemplos guiados.
4. El sistema presenta preguntas de verificacion rapida.
5. El estudiante responde las verificaciones por tema.
6. El sistema registra avance, aciertos, errores y conceptos con dificultad.
7. El sistema recomienda refuerzo o permite continuar hacia retos relacionados.

### HU007: Resolucion de retos interactivos

1. El estudiante inicia sesion.
2. El estudiante selecciona un reto de Fisica Dinamica.
3. El sistema carga ejercicios sobre fuerza, masa, aceleracion o leyes de Newton.
4. El estudiante responde cada ejercicio.
5. El sistema valida la respuesta y muestra retroalimentacion inmediata.
6. El sistema registra tiempo, intentos, respuestas correctas e incorrectas.
7. El sistema actualiza puntaje, progreso, racha, XP, gemas e insignias.
8. Si detecta errores frecuentes, genera recomendaciones de refuerzo.

### HU002: Analiticas IA y ejercicios personalizados

1. El sistema consulta registros de progreso del estudiante.
2. El panel lateral muestra tiempo promedio, intentos fallidos, tema con mas errores y desempeno general.
3. El estudiante solicita ejercicios personalizados.
4. El backend envia metricas del estudiante al servicio predictivo.
5. Gemini 1.5 Flash genera recomendacion, tendencia y siguiente reto personalizado.
6. El frontend actualiza el panel central con la nueva pregunta, opciones y diagrama fisico.
7. Si la IA falla, el backend devuelve un fallback estructurado.

### HU004: Analisis predictivo con Gemini 1.5 Flash

1. El frontend envia patrones de error, velocidad de respuesta, tema actual y progreso.
2. El backend prepara una solicitud con datos minimos del estudiante.
3. Gemini 1.5 Flash analiza riesgo, tendencia conductual y posibles dificultades.
4. El backend recibe un JSON con analiticas, prediccion, recomendacion y reto personalizado.
5. El frontend muestra alerta, sugerencias de refuerzo y reto de nivelacion.
6. Si Gemini falla o devuelve un formato invalido, el backend responde con una prediccion local estructurada.

## Datos de entrada

- Datos de registro del estudiante.
- Credenciales de acceso.
- Respuestas de encuesta inicial.
- Preferencias y dificultades declaradas.
- Identificador del estudiante.
- Identificador del contenido o tema.
- Identificador del reto o ejercicio.
- Respuestas enviadas por el estudiante.
- Tiempo de respuesta por ejercicio.
- Numero de intento.
- Historial de progreso por tema.
- Racha de errores y respuestas incorrectas consecutivas.
- Tema actual y nivel de dificultad.

## Datos de salida

- Perfil de estudiante creado.
- Estado de encuesta inicial completada o pendiente.
- Perfil academico inicial.
- Contenidos recomendados de Fisica Dinamica.
- Resultado correcto o incorrecto por respuesta.
- Retroalimentacion inmediata.
- Puntaje, XP, gemas, racha e insignias actualizadas.
- Progreso actualizado por tema.
- Tema con dificultad detectada.
- Analiticas de desempeno del estudiante.
- Recomendaciones de refuerzo.
- Prediccion de dificultad generada por IA.
- Reto personalizado con pregunta, opciones y respuesta correcta.
- Fallback estructurado cuando falla la integracion con IA.

## Alcance de la prueba de concepto

La PoC demuestra el flujo principal de aprendizaje personalizado: un estudiante se registra, completa una encuesta inicial, estudia contenidos de Fisica Dinamica, resuelve retos interactivos, recibe retroalimentacion, acumula progreso gamificado y obtiene recomendaciones basadas en analiticas e IA predictiva.

El alcance minimo incluye:

- Registro y perfil inicial de estudiante.
- Encuesta inicial de personalizacion.
- Modulo de estudio para fuerza, masa, aceleracion y leyes de Newton.
- Retos interactivos con validacion de respuestas.
- Registro de intentos, tiempos, aciertos, errores y progreso.
- Panel de analiticas del desempeno.
- Generacion de ejercicios personalizados.
- Integracion preparada con Gemini 1.5 Flash.
- Fallback local para conservar el flujo cuando la IA externa no responde.

## Reglas funcionales transversales

- Toda actividad academica debe asociarse a un estudiante registrado.
- La encuesta inicial debe completarse antes de generar recomendaciones personalizadas completas.
- El progreso debe actualizarse por tema y no solo por ejercicio individual.
- Las respuestas correctas e incorrectas deben registrarse para alimentar analiticas.
- La retroalimentacion debe mostrarse de forma inmediata despues de cada respuesta.
- Las recomendaciones deben considerar errores frecuentes, tiempo de respuesta, intentos y progreso.
- Los retos personalizados deben mantener coherencia con el tema y nivel del estudiante.
- La integracion con Gemini debe conservar un contrato de respuesta estable para el frontend.
- Ante fallos externos, el sistema debe responder con datos locales estructurados para no interrumpir la experiencia.
