# Deployment

Nutrio is deployed as a small Docker-based stack.

## Services

| Service | Purpose |
| --- | --- |
| `frontend` | Serves the built frontend through Nginx |
| `api` | Runs Prisma migrations and starts the Express API |
| `db` | Stores products and day entries |
| `pgadmin` | Optional database UI |

## Ports

| Port | Use |
| --- | --- |
| `8080` | Main app |
| `5050` | pgAdmin |

The API stays inside the Docker network and is reached through Nginx.

## Container behavior

- the frontend image builds `dist/` and serves it with Nginx
- the API image generates the Prisma client and starts the server
- the API container runs `npm run prisma:migrate:deploy` on startup

## Before publishing

- set real values in `.env`
- confirm PostgreSQL data is persistent
- confirm `/api/health` returns `200`
- confirm frontend routing works after refresh

## Production notes

For a more serious deployment, consider:

- authentication
- backups
- structured logs
- monitoring
- restricted access to pgAdmin
