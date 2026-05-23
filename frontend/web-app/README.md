# Web App - React

Interfaz web principal de PhysicsPlay construida con React y Vite.

Pantallas previstas para HU007:

- Inicio de sesion del estudiante.
- Panel de misiones y retos de Fisica Dinamica.
- Resolucion de ejercicios interactivos sobre fuerza, masa, aceleracion y leyes de Newton.
- Retroalimentacion inmediata por respuesta.
- Resumen de puntaje, progreso, intentos y recomendaciones de refuerzo.

La implementacion visual debe mantener el enfoque gamificado del proyecto: niveles, puntos, insignias, progreso y misiones.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Configuracion

Crear un archivo `.env` tomando como referencia `.env.example`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

La web app consume el backend Spring Boot. Si el backend no esta disponible, mantiene un modo demo local para presentar el flujo de HU007.
