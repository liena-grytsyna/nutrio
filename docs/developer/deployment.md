# Deployment

This page documents how Nutrio is packaged and what the runtime topology looks like.

## Docker services

| Service | Image or build | Purpose |
| --- | --- | --- |
| `frontend` | Local `Dockerfile` | Builds the frontend and serves it through Nginx |
| `api` | Local `Dockerfile.api` | Runs Prisma migrations and starts the API |
| `db` | `postgres:16-alpine` | Stores products and day entries |
| `pgadmin` | `dpage/pgadmin4:latest` | Optional inspection UI for the database |

## Published ports

| Port | Service | Use |
| --- | --- | --- |
| `8080` | frontend | Main application URL |
| `5050` | pgAdmin | Database administration |

The API stays internal to the Docker network and is reached through Nginx.

## Frontend container behavior

The frontend image uses a two-stage build:

1. `node:22-alpine` installs dependencies and runs `npm run build`
2. `nginx:1.27-alpine` serves the generated `dist/` directory

Nginx also proxies `/api/*` to the API container and serves the SPA with `try_files ... /index.html`.

## API container behavior

The API image:

1. installs dependencies
2. copies `prisma/` and generates the Prisma client
3. copies the `server/` directory
4. runs `npm run prisma:migrate:deploy && npm run api:start`

This means schema migrations are applied automatically when the API container starts.

## Deployment checklist

- Set strong values in `.env` before publishing the stack
- Confirm PostgreSQL data volumes are persistent
- Confirm `http://<host>/api/health` returns `200`
- Confirm frontend routing works after reloading deep links
- Confirm the API container can reach the database before accepting traffic

## Environment hardening notes

The current stack is good for development and small deployments, but consider these upgrades before production use:

- add authentication if data should be user-owned rather than browser-owned
- protect or remove pgAdmin in public environments
- add structured logging and monitoring
- back up PostgreSQL volumes
- review entry deletion rules and ownership validation

## Static documentation publishing

The MkDocs site itself is configured separately from the main Nutrio application and can be published to GitHub Pages or any static hosting provider after running a standard MkDocs build in an environment where MkDocs is installed.
