# Local vs Producción — Cómo alternar

Registro de los puntos de configuración que cambian entre **local** y **producción** (frontend en Vercel + backend en Render). Úsalo para ir y volver sin romper nada.

## Estado actual por módulo

| Módulo | Local | Producción |
| --- | --- | --- |
| `frontend/frontend-web/.env` | `VITE_API_URL=http://localhost:3000` | En Vercel: `VITE_API_URL=https://proyectoillapel.onrender.com` (env var del dashboard) |
| `app-movil/src/config/api.js` | `http://<IP-LAN>:3000/api` | `https://proyectoillapel.onrender.com/api` |
| `backend/.env` | `DB_HOST=localhost` + Postgres local | Credenciales de la BD en Render |
| `backend/config/db.js` | SSL automático (solo remoto) | SSL activo (no requiere cambio de código) |

## Cambios hechos para funcionar en local

1. **`backend/config/db.js`** — SSL ahora es **condicional**: se activa solo cuando `DB_HOST` no es `localhost`/`127.0.0.1`. Motivo: el Postgres local (nativo, sin Docker) no soporta SSL y antes el backend lo forzaba siempre, lo que impedía conectar. En producción (Render) el SSL sigue activo automáticamente, sin tocar nada.
2. **`app-movil/src/config/api.js`** — `API_URL` apunta a `http://192.168.1.96:3000/api` (IP LAN del PC, revisa tu IP actual con `ipconfig`). La URL de Render quedó comentada dentro del archivo.

## Volver a producción

1. `app-movil/src/config/api.js` → comentar la sección LOCAL y descomentar `export const API_URL = 'https://proyectoillapel.onrender.com/api';`
2. Frontend en Vercel → asegurarse de que la env var `VITE_API_URL` apunte a `https://proyectoillapel.onrender.com` (el código usa ese valor; si falta, caen a un fallback hardcodeado con la misma URL).
3. `backend/.env` → apuntar `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`/`DB_PORT` a la BD de Render. No requiere cambios de código (el SSL se activa solo).

## Volver a local

1. `app-movil/src/config/api.js` → `LOCAL_IP` = IP actual del PC y teléfono en la misma red Wi-Fi.
2. `frontend/frontend-web/.env` → `VITE_API_URL=http://localhost:3000`.
3. `backend/.env` → `DB_HOST=localhost`, `DB_USER=postgres`, `DB_PASSWORD=adminpassword`, `DB_PORT=5432`, `DB_NAME=illapel_ayuda`.
4. Levantar: `docker compose up -d db` **o** usar el Postgres nativo ya instalado (v17). Si se usa el nativo y las tablas ya existen, **no** correr `initDB.js` (borra todo).

## Notas

- Los `console.log` y fallbacks con `proyectoillapel.onrender.com` en `src/components/*` y `src/services/*` del frontend web solo se usan si `VITE_API_URL` no está definida; en local `.env` la define, así que no afectan.
- No hay autenticación real en los endpoints: cualquier persona con acceso a la red puede llamar a la API.
