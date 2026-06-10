# HU003: Encuesta inicial para personalizacion del aprendizaje

## Historia de usuario

Como estudiante, necesito responder una encuesta inicial, para personalizar mi experiencia de aprendizaje.

## Justificacion

La HU003 se identifica como una historia de soporte esencial porque permite conocer el punto de partida del estudiante antes de iniciar la practica de Fisica Dinamica. Esta encuesta inicial ayuda a adaptar contenidos, retos y recomendaciones segun los conocimientos previos, intereses, dificultades percibidas y preferencias de aprendizaje del estudiante.

Ademas, esta historia permite recopilar datos relevantes para la personalizacion educativa:

- Nivel de conocimiento previo sobre Fisica Dinamica.
- Percepcion de dificultad en fuerza, masa, aceleracion y leyes de Newton.
- Preferencias de ritmo de aprendizaje.
- Objetivos academicos del estudiante.
- Temas que el estudiante considera mas complejos.
- Confianza inicial para resolver ejercicios.
- Necesidad de apoyo o refuerzo antes de iniciar retos.

Esta informacion puede utilizarse posteriormente para implementar funcionalidades con inteligencia artificial:

- Generacion de rutas de aprendizaje adaptativas.
- Recomendacion inicial de temas y ejercicios personalizados.
- Prediccion temprana de posibles dificultades academicas.
- Seleccion de retos con nivel de complejidad adecuado.
- Ajuste dinamico de contenidos segun el perfil del estudiante.
- Comparacion entre percepcion inicial y desempeno real en ejercicios.

La HU003 se alinea con el enfoque principal de PhysicsPlay porque convierte el registro del estudiante en una experiencia personalizada y prepara la plataforma para ofrecer una ruta de aprendizaje mas relevante.

## Criterios de aceptacion

### Escenario 1: Presentacion de la encuesta inicial

**Given** que el estudiante ya se registro en la plataforma y aun no completo su encuesta inicial,  
**When** ingresa por primera vez a PhysicsPlay,  
**Then** el sistema debe mostrar la encuesta inicial antes de habilitar la experiencia personalizada de aprendizaje.

### Escenario 2: Registro de respuestas del estudiante

**Given** que el estudiante responde todas las preguntas obligatorias de la encuesta inicial,  
**When** envia sus respuestas,  
**Then** el sistema debe guardar la informacion, actualizar el perfil academico inicial y marcar la encuesta como completada.

### Escenario 3: Personalizacion inicial de contenidos

**Given** que la encuesta inicial identifica dificultades o intereses especificos del estudiante,  
**When** el sistema genera la vista inicial de aprendizaje,  
**Then** debe sugerir contenidos, temas o retos acordes con el perfil registrado del estudiante.

## Alcance minimo viable de la PoC

- Encuesta inicial con preguntas cerradas y opciones predefinidas.
- Validacion de respuestas obligatorias.
- Registro de respuestas asociadas al estudiante.
- Creacion de un perfil academico inicial.
- Marcado de encuesta completada.
- Sugerencia inicial de temas de Fisica Dinamica.
- Redireccion hacia contenidos o retos recomendados.
- Base para futuras recomendaciones personalizadas con IA.

## Reglas de negocio iniciales

- La encuesta inicial debe estar asociada a un estudiante registrado.
- Cada estudiante debe completar la encuesta una vez antes de recibir recomendaciones personalizadas.
- Las preguntas obligatorias deben responderse antes de enviar la encuesta.
- Las respuestas deben actualizar el perfil academico inicial del estudiante.
- Las recomendaciones iniciales deben considerar las dificultades declaradas por el estudiante.
- El perfil inicial puede complementarse posteriormente con datos reales de desempeno en retos y ejercicios.
