# Estructura del frontend

Organizacion de la web app React + Vite adaptada al esquema por capas:
`app`, `Core`, `Layout`, `Modules` y `Shared`.

```text
Frontend/web-app/
|-- index.html
|-- vite.config.js
|-- package.json
|-- GUIA-MODIFICAR.md
`-- src/
    |-- main.jsx
    |-- styles.css
    |-- styles/
    |   `-- global.css
    `-- app/
        |-- app.jsx                 # Componente raiz
        |-- app.config.jsx          # Providers globales: router + estado
        |-- app.routes.jsx          # Rutas principales
        |-- app.css
        |
        |-- Core/
        |   |-- Guards/             # Proteccion de sesion y roles
        |   |-- Interfaces/         # Reservado para tipos/contratos del dominio
        |   |-- Services/           # API, autenticacion, retos, IA, admin, profesor
        |   |-- Models/             # Rutas, navegacion y datos por defecto
        |   |-- Utils/              # Funciones puras reutilizables
        |   `-- Context/            # AppProvider, AppContext, hook useApp
        |
        |-- Layout/
        |   |-- pagina-layout-estudiante/
        |   `-- Components/
        |       |-- barra-navegacion/
        |       |-- barra-lateral/
        |       `-- barra-consejos/
        |
        |-- Modules/
        |   |-- Auth/
        |   |-- Estudiante/
        |   |-- Admin/
        |   |-- Profesor/
        |   `-- IA/
        |
        `-- Shared/
            `-- Components/
                |-- campo-formulario/
                |-- cargando-sesion/
                |-- diagrama-fisica/
                |-- encabezado-pagina/
                |-- iconos/
                |-- item-navegacion/
                |-- panel-lateral-ia/
                |-- portada-auth/
                `-- retroalimentacion-ejercicio/
```

## Criterio de ubicacion

- `Core`: codigo transversal que no pertenece a una pantalla concreta.
- `Layout`: estructura fija de pantalla, como navbar, sidebar y shell.
- `Modules`: funcionalidad por dominio. Cada modulo contiene rutas y paginas.
- `Shared`: componentes reutilizables sin reglas de negocio propias.

## Rutas principales

| Ruta | Modulo | Pagina |
| --- | --- | --- |
| `/auth/login` | Auth | `pagina-login` |
| `/auth/register` | Auth | `pagina-registro` |
| `/app/onboarding` | Estudiante | `pagina-onboarding` |
| `/app/onboarding/resumen` | Estudiante | `pagina-resumen-ruta` |
| `/app/inicio` | Estudiante | `pagina-inicio` |
| `/app/retos` | Estudiante | `pagina-retos` |
| `/app/ia` | IA | `pagina-panel-ia` |
| `/app/progreso` | Estudiante | `pagina-progreso` |
| `/app/ranking` | Estudiante | `pagina-ranking` |
| `/app/notas` | Estudiante | `pagina-notas` |
| `/app/profesor` | Profesor | `pagina-panel-profesor` |
| `/app/admin` | Admin | `pagina-panel-admin` |

## Convenciones

- Los archivos nuevos pueden nombrarse en espanol cuando el nombre siga siendo claro.
- Las paginas viven en `Modules/<Dominio>/pages/<pagina-nombre>/`.
- Los componentes compartidos viven en `Shared/Components/<nombre-componente>/`.
- Evitar `fetch` directo en paginas: usar `Core/Services`.
- Las rutas globales se declaran en `app.routes.jsx`; las rutas de modulo se declaran dentro de cada modulo.
- Para saber donde modificar cada pantalla, revisa `GUIA-MODIFICAR.md`.
