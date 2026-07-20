# PhysicsPlay - Plataforma Gamificada de Fisica

PhysicsPlay es una plataforma gamificada orientada a estudiantes de 5to de secundaria que necesitan reforzar el aprendizaje de Fisica, especialmente en temas de dinamica como fuerza, masa, aceleracion y leyes de Newton.

El alcance actual del repositorio incluye la implementacion y documentacion de la prueba de concepto de PhysicsPlay a partir de historias de usuario relacionadas con registro, personalizacion, estudio de contenidos, practica interactiva y apoyo educativo con IA.

La historia de usuario principal sigue siendo:

> **HU007:** Como estudiante, necesito resolver retos y ejercicios interactivos para practicar los temas aprendidos.

## Objetivo del prototipo

Desarrollar una base organizada para implementar el registro del estudiante, la encuesta inicial, el estudio de contenidos de Fisica Dinamica, la resolucion de retos interactivos, la retroalimentacion inmediata, el registro del desempeno y la integracion con inteligencia artificial para orientar al estudiante y recomendar actividades personalizadas.

## Stack tecnologico definido

- Frontend web: React con Vite.
- Backend: Spring Boot con arquitectura por capas.
- Base de datos: Supabase con PostgreSQL.
- Persistencia: Spring Data JPA.
- Migraciones: Flyway.
- Documentacion API: OpenAPI/Swagger.
- Proveedor de IA: Google Gemini, consumido exclusivamente desde el backend.

## Estructura del repositorio

```text
plataforma-gamificada-fisica/
|-- frontend/
|   |-- web-app/
|   `-- mobile-app/
|-- backend/
|   |-- controllers/
|   |-- models/
|   |-- services/
|   |-- repositories/
|   |-- middleware/
|   `-- integrations/
|-- database/
|   |-- scripts/
|   |-- procedures/
|   `-- backups/
|-- docs/
|   |-- arquitectura/
|   |-- historias-usuario/
|   `-- diagramas/
|-- tests/
|-- .github/
|   `-- workflows/
`-- README.md
```

## Documentacion principal

- [Historia de usuario HU001](docs/historias-usuario/HU001-registro-estudiante-plataforma.md)
- [Historia de usuario HU002](docs/historias-usuario/HU002-analiticas-ia-ejercicios-personalizados.md)
- [Historia de usuario HU003](docs/historias-usuario/HU003-encuesta-inicial-personalizacion.md)
- [Historia de usuario HU004](docs/historias-usuario/HU004-ia-predictiva-gemini.md)
- [Historia de usuario HU005](docs/historias-usuario/HU005-estudio-conceptos-dinamica.md)
- [Historia de usuario HU007](docs/historias-usuario/HU007-resolucion-retos-ejercicios-interactivos.md)
- [Analisis funcional de todas las historias de usuario](docs/arquitectura/analisis-funcional-historias-usuario.md)
- [Analisis funcional de HU007](docs/arquitectura/analisis-funcional-hu007.md)
- [Arquitectura en capas](docs/arquitectura/arquitectura-en-capas-hu007.md)
- [Seleccion tecnologica](docs/arquitectura/seleccion-tecnologica.md)
- [Casos de prueba Given-When-Then por historia de usuario](tests/historias-usuario-casos-given-when-then.md)
- [Casos de prueba Given-When-Then](tests/HU007-casos-given-when-then.md)

## Ejecucion local

Frontend:

```bash
cd frontend/web-app
npm install
npm run dev
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

Para conectar con Supabase y Google Gemini, consultar `backend/.env.example`, configurar las variables de entorno y exponerlas en la terminal antes de iniciar Spring Boot. Las claves reales no deben guardarse en el repositorio.

## Datos clave que registran las historias de usuario

- Perfil y estado de registro del estudiante.
- Respuestas de la encuesta inicial.
- Preferencias, dificultades declaradas y perfil academico inicial.
- Contenidos de Fisica Dinamica consultados.
- Tiempo de resolucion de ejercicios.
- Cantidad de intentos realizados.
- Respuestas correctas e incorrectas.
- Temas con mayor dificultad.
- Frecuencia de uso de la plataforma.
- Progreso academico por tema.
- Patrones de error frecuentes.
- Nivel de avance del estudiante.

## Funcionalidades con IA

- Chat educativo Connor para consultas escolares de Fisica en la seccion Tutor IA.
- Respuestas concisas con contexto reciente limitado y control de consumo de tokens.
- Analisis predictivo y recomendaciones personalizadas basadas en la actividad registrada.

Evoluciones previstas:

- Prediccion de temas dificiles por estudiante.
- Recomendacion automatica de ejercicios personalizados.
- Deteccion temprana de bajo rendimiento academico.
- Generacion de rutas de aprendizaje adaptativas.
- Identificacion de errores conceptuales frecuentes.
- Prediccion de probabilidades de aprobacion en evaluaciones.
