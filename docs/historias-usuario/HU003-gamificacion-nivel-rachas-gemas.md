# HU003 - Barra de progreso de gamificacion general

## Historia de Usuario

Como estudiante, quiero ver mi nivel, progreso de XP, racha actual y balance de gemas para entender mi avance general y mantener motivacion.

## Criterios de Aceptacion

### Escenario 1: Estado inicial visible

Dado que el estudiante Alex Rivera ingresa a PhysicsPlay, cuando se carga la aplicacion, entonces la barra superior debe mostrar Nivel 15, 1250 XP y 1,250 Gemas.

### Escenario 2: Actualizacion por respuesta correcta

Dado que el estudiante responde correctamente un reto, cuando el backend confirma la respuesta, entonces el frontend debe actualizar XP total, gemas y racha actual sin recargar la pagina.

### Escenario 3: Control de rachas

Dado que el estudiante responde correctamente de forma consecutiva, cuando cada respuesta es evaluada, entonces `current_streak` debe incrementarse y `best_streak` debe conservar la mejor marca.

### Escenario 4: Error y reinicio de racha

Dado que el estudiante falla un ejercicio, cuando el backend procesa la respuesta, entonces la racha actual debe reiniciarse a cero y el progreso por tema debe registrar un intento incorrecto.
