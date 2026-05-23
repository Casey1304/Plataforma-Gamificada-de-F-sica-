# PhysicsPlay - Plataforma Gamificada de Fisica

PhysicsPlay es una plataforma gamificada orientada a estudiantes de 5to de secundaria que necesitan reforzar el aprendizaje de Fisica, especialmente en temas de dinamica como fuerza, masa, aceleracion y leyes de Newton.

El alcance actual del repositorio se centra en la prueba de concepto de la historia de usuario principal:

> **HU007:** Como estudiante, necesito resolver retos y ejercicios interactivos para practicar los temas aprendidos.

## Objetivo del prototipo

Desarrollar una base organizada para implementar la resolucion de retos interactivos, la retroalimentacion inmediata, el registro del desempeno del estudiante y la futura integracion con inteligencia artificial para recomendar actividades personalizadas.

## Stack tecnologico definido

- Frontend web: React con Vite.
- Backend: Spring Boot con arquitectura por capas.
- Base de datos: Supabase con PostgreSQL.
- Persistencia: Spring Data JPA.
- Migraciones: Flyway.
- Documentacion API: OpenAPI/Swagger.

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

- [Historia de usuario HU007](docs/historias-usuario/HU007-resolucion-retos-ejercicios-interactivos.md)
- [Analisis funcional de HU007](docs/arquitectura/analisis-funcional-hu007.md)
- [Arquitectura en capas](docs/arquitectura/arquitectura-en-capas-hu007.md)
- [Seleccion tecnologica](docs/arquitectura/seleccion-tecnologica.md)
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

Para conectar con Supabase, copiar `backend/.env.example`, configurar las variables de conexion y exponerlas en la terminal antes de iniciar Spring Boot.

## Datos clave que registra HU007

- Tiempo de resolucion de ejercicios.
- Cantidad de intentos realizados.
- Respuestas correctas e incorrectas.
- Temas con mayor dificultad.
- Frecuencia de uso de la plataforma.
- Progreso academico por tema.
- Patrones de error frecuentes.
- Nivel de avance del estudiante.

## Funcionalidades futuras con IA

- Prediccion de temas dificiles por estudiante.
- Recomendacion automatica de ejercicios personalizados.
- Deteccion temprana de bajo rendimiento academico.
- Generacion de rutas de aprendizaje adaptativas.
- Identificacion de errores conceptuales frecuentes.
- Prediccion de probabilidades de aprobacion en evaluaciones.
