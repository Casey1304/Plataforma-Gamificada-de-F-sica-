# Estructura del frontend (PhysicsPlay)

```
src/
├── main.jsx                    # Entrada: monta React y estilos globales
├── App.jsx                     # Reexporta app/App.jsx (compatibilidad)
│
├── app/
│   └── App.jsx                 # Orquestador: estado, sesión, qué pantalla mostrar
│
├── nucleo/                     # Lógica compartida (sin UI de pantalla)
│   ├── servicios/
│   │   ├── api.js              # Llamadas al backend REST
│   │   └── sesion.js           # Guardar/restaurar sesión en localStorage
│   ├── utilidades/
│   │   ├── retos.js            # Armar desafíos desde API o IA
│   │   ├── retroalimentacionEstudiante.js
│   │   └── formato.js          # Números, letras A/B/C/D
│   └── constantes/
│       ├── usuario.js
│       ├── desafios.js
│       ├── onboarding.js
│       └── ia.js
│
├── compartido/                 # Piezas reutilizables
│   ├── componentes/
│   │   ├── Iconos.jsx
│   │   ├── CampoFormulario.jsx
│   │   └── EncabezadoPagina.jsx
│   ├── paginas/
│   │   └── CargaSesion.jsx
│   └── estilos/
│       ├── global.css          # Estilos principales de la app
│       └── carga.css
│
└── modulos/                    # Pantallas por rol / flujo
    ├── autenticacion/
    │   ├── componentes/
    │   │   ├── HeroAutenticacion.jsx
    │   │   └── HeroAutenticacion.css
    │   └── paginas/
    │       ├── PaginaAutenticacion.jsx   # Login y registro
    │       └── PaginaAutenticacion.css
    │
    ├── estudiante/
    │   ├── paginas/
    │   │   ├── PaginaRetos.jsx           # Panel central: ejercicios y retos
    │   │   ├── PaginaRetos.css
    │   │   ├── PaginaOnboarding.jsx      # Configuración inicial
    │   │   ├── PaginaOnboarding.css
    │   │   ├── PaginaResumen.jsx         # Resumen antes del dashboard
    │   │   └── PaginaResumen.css
    │   ├── componentes/
    │   │   ├── DiagramaFisica.jsx        # Bloque 10 kg / flecha
    │   │   ├── RetroalimentacionEjercicio.jsx
    │   │   └── PanelLateralIa.jsx        # Columna derecha IA
    │   └── utilidades/
    │       └── resumenRuta.js
    │
    ├── profesor/
    │   └── paginas/
    │       ├── PaginaProfesor.jsx
    │       └── PaginaProfesor.css
    │
    └── administrador/
        └── paginas/
            ├── PaginaAdministrador.jsx
            └── PaginaAdministrador.css
```

## Dónde editar cada parte

| Qué quieres cambiar | Archivo |
|---------------------|---------|
| Login / registro | `modulos/autenticacion/paginas/PaginaAutenticacion.jsx` |
| Página de ejercicios (retos) | `modulos/estudiante/paginas/PaginaRetos.jsx` |
| Bloque visual (masa, flecha) | `modulos/estudiante/componentes/DiagramaFisica.jsx` |
| Retroalimentación al resolver | `modulos/estudiante/componentes/RetroalimentacionEjercicio.jsx` |
| Panel IA (derecha) | `modulos/estudiante/componentes/PanelLateralIa.jsx` |
| Onboarding | `modulos/estudiante/paginas/PaginaOnboarding.jsx` |
| Panel profesor / admin | `modulos/profesor/...` y `modulos/administrador/...` |
| Llamadas API | `nucleo/servicios/api.js` |
| Estilos globales | `compartido/estilos/global.css` y `src/styles.css` (mismo contenido; se cargan en `main.jsx`) |
| Flujo entre pantallas | `app/App.jsx` |
