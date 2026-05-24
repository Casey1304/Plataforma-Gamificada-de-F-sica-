# Analisis funcional - HU007

## Proposito

Definir los componentes funcionales minimos de la prueba de concepto para que un estudiante resuelva retos interactivos de Fisica Dinamica en PhysicsPlay.

## Tabla de analisis funcional

| Elemento | Descripcion |
| --- | --- |
| Actor principal | Estudiante de 5to de secundaria |
| Actor secundario | Docente que revisa el progreso |
| Servicio interno | Motor de retos y ejercicios |
| Servicio interno | Motor de puntaje, progreso e insignias |
| Integracion externa | Gemini 1.5 Flash para prediccion de dificultades y generacion de reto personalizado |
| Funcion principal | Resolver retos y ejercicios interactivos |
| Funcion secundaria | Registrar respuestas, tiempos, intentos y progreso |
| Funcion secundaria | Recomendar ejercicios de refuerzo |
| Restriccion | Acceso autenticado y registro seguro del desempeno academico |

## Procesos principales

1. El estudiante inicia sesion.
2. El estudiante selecciona un reto de Fisica Dinamica.
3. El sistema carga ejercicios sobre fuerza, masa, aceleracion o leyes de Newton.
4. El estudiante responde cada ejercicio.
5. El sistema valida la respuesta y muestra retroalimentacion inmediata.
6. El sistema registra tiempo, intentos, respuestas correctas e incorrectas.
7. El sistema actualiza puntaje, progreso e insignias.
8. Si detecta errores frecuentes, genera recomendaciones de refuerzo.
9. La IA predictiva analiza racha de errores, respuestas incorrectas consecutivas, tiempo promedio y tema actual.
10. Gemini 1.5 Flash devuelve alerta, tendencia, checklist de refuerzo y un reto personalizado.

## Datos de entrada

- Identificador del estudiante.
- Identificador del reto.
- Respuestas enviadas.
- Tiempo de respuesta por ejercicio.
- Numero de intento.

## Datos de salida

- Resultado correcto o incorrecto.
- Retroalimentacion inmediata.
- Puntaje obtenido.
- Progreso actualizado.
- Tema con dificultad detectada.
- Recomendaciones de refuerzo.
- Prediccion de dificultad generada por IA.
- Reto personalizado generado por Gemini con pregunta, opciones y respuesta correcta.

## Alcance de la prueba de concepto

La PoC demuestra el flujo principal de HU007 con datos iniciales, persistencia de progreso y una integracion real preparada para Gemini 1.5 Flash. Si el proveedor externo falla, el backend conserva un fallback estructurado para no interrumpir la experiencia del estudiante.
