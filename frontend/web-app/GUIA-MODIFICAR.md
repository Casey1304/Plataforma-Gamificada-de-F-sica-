# Guia rapida para modificar el frontend

Esta guia responde la pregunta: "si quiero cambiar algo de la pantalla, donde esta?".

## Barra lateral izquierda

La barra lateral que aparece en Retos, Progreso, Ranking y Notas se divide en dos partes:

| Que quieres cambiar | Archivo |
| --- | --- |
| Texto, orden, icono o ruta de un boton | `src/app/Core/Models/navegacion.js` |
| HTML/JSX que dibuja la barra | `src/app/Layout/Components/barra-lateral/barra-lateral.jsx` |
| Estilos visuales de la barra | `src/app/Layout/pagina-layout-estudiante/pagina-layout-estudiante.css` |
| Iconos disponibles | `src/app/Shared/Components/iconos/iconos.jsx` |

Para agregar un boton nuevo:

1. Agrega un objeto en `STUDENT_NAV_LINKS` dentro de `Core/Models/navegacion.js`.
2. Agrega la constante de ruta en `Core/Models/rutas.js`.
3. Agrega el `<Route>` en `Modules/Estudiante/estudiante.routes.jsx`.
4. Crea la pagina en `Modules/Estudiante/pages/pagina-tu-seccion/`.

## Pagina Retos

| Parte de la pantalla | Archivo |
| --- | --- |
| Estructura principal de Retos | `src/app/Modules/Estudiante/pages/pagina-retos/pagina-retos.jsx` |
| Estilos de Retos | `src/app/Modules/Estudiante/pages/pagina-retos/pagina-retos.css` |
| Datos y acciones usadas por Retos | `src/app/Core/Context/proveedor-app.jsx` |
| Diagrama de fisica | `src/app/Shared/Components/diagrama-fisica/diagrama-fisica.jsx` |
| Resultado/respuesta correcta | `src/app/Shared/Components/retroalimentacion-ejercicio/retroalimentacion-ejercicio.jsx` |
| Panel derecho de IA | `src/app/Shared/Components/panel-lateral-ia/panel-lateral-ia.jsx` |

Dentro de `pagina-retos.jsx` tambien hay un comentario con el mapa de bloques:
barra superior, enunciado, alternativas, botones, resultado y panel IA.

## Paginas del estudiante

| Ruta | Pagina |
| --- | --- |
| `/app/inicio` | `Modules/Estudiante/pages/pagina-inicio/` |
| `/app/retos` | `Modules/Estudiante/pages/pagina-retos/` |
| `/app/ia` | `Modules/IA/pages/pagina-panel-ia/` |
| `/app/progreso` | `Modules/Estudiante/pages/pagina-progreso/` |
| `/app/ranking` | `Modules/Estudiante/pages/pagina-ranking/` |
| `/app/notas` | `Modules/Estudiante/pages/pagina-notas/` |

## Regla simple

- `Core`: datos, servicios, rutas, contexto y logica compartida.
- `Layout`: estructura fija de pantalla, como navbar y sidebar.
- `Modules`: pantallas por dominio.
- `Shared`: componentes reutilizables que varias pantallas pueden usar.
