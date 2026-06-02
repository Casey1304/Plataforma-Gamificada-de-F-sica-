# Mobile App — Estilos moviles

En esta prueba de concepto, la experiencia movil se implementa como capa responsive sobre `frontend/web-app/`.

## Ubicacion del codigo movil

```text
frontend/mobile-app/
`-- styles/
    `-- mobile.css    # Solo reglas @media (max-width); no afecta escritorio
```

Los estilos se importan desde `web-app/src/styles.css`. No duplican logica ni servicios: solo mejoran layout, espaciado, navegacion tactil y safe-area en pantallas pequenas.

## Alcance

- Layout del estudiante (navbar, navegacion inferior sticky, contenido, panel IA).
- Paginas de retos, inicio, progreso, ranking y auth/onboarding en movil.
- Areas seguras (`env(safe-area-inset-*)`) para dispositivos con notch.

## Fuera de alcance (sin cambios)

- Backend, endpoints, servicios y contratos JSON.
- Estilos base de escritorio en `web-app/src/styles/global.css` y CSS por pagina.
