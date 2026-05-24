# HU001 - Resolucion de retos dinamicos con retroalimentacion inmediata y recompensa

## Historia de Usuario

Como estudiante de Fisica, quiero resolver retos dinamicos con opciones multiples y recibir retroalimentacion inmediata para entender mi error o confirmar mi solucion mientras gano XP y gemas.

## Criterios de Aceptacion

### Escenario 1: Respuesta correcta

Dado que el estudiante esta en el reto "Leyes de Newton" y selecciona la respuesta "20 N", cuando presiona "Resolver ejercicio", entonces el sistema debe mostrar "¡Correcto!", explicar `F = m x a = 20 N`, sumar `+50 XP`, sumar `+10 Gemas` e incrementar la racha.

### Escenario 2: Respuesta incorrecta

Dado que el estudiante selecciona una respuesta distinta a la correcta, cuando envia la respuesta, entonces el sistema debe registrar el intento, mostrar retroalimentacion correctiva y reiniciar la racha actual.

### Escenario 3: Persistencia analitica

Dado que el backend recibe una respuesta, cuando termina la evaluacion, entonces debe guardar la respuesta en `exercise_answers`, actualizar `progress_by_topic` y devolver la precision actual del intento.

### Escenario 4: Modo demo

Dado que el backend no esta disponible, cuando el estudiante resuelve el reto en el frontend, entonces la interfaz debe seguir funcionando con datos locales de demostracion.
