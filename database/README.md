# Database

Recursos de base de datos de PhysicsPlay para **Supabase PostgreSQL**.

## Scripts principales

Ver `scripts/README.md`:

- `000_supabase_reset.sql` — borra tablas (solo desarrollo).
- `001_supabase_schema.sql` — esquema completo alineado con el backend Java.

La misma definicion esta en Flyway: `backend/src/main/resources/db/migration/V1__physicsplay_schema.sql`.

## Carpetas

- `scripts/` — esquema y reinicio para Supabase SQL Editor.
- `procedures/` — procedimientos almacenados (futuro).
- `backups/` — respaldos de desarrollo.
