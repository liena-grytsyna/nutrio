# Quick Start

Nutrio can be started in two ways:

- `Docker Compose` for the fastest end-to-end setup
- `Local development` if you want to run the frontend and API separately

## Requirements

| Tool | Why it is needed |
| --- | --- |
| `Node.js 22` | Required for local frontend and API execution |
| `npm` | Used for package installation and scripts |
| `Docker` | Required for the containerized workflow |
| `PostgreSQL` | Required only for local API development outside Docker |

## Fastest path: Docker Compose

!!! tip "Recommended for first run"
    If your goal is to try the app quickly, start with Docker. It gives you the frontend, API, database, and pgAdmin in one command.

=== "docker compose"
    ```bash
    cp .env.example .env
    docker compose up --build
    ```

=== "docker-compose"
    ```bash
    cp .env.example .env
    docker-compose up --build
    ```

After startup, these endpoints should be available:

| Service | URL |
| --- | --- |
| App | `http://localhost:8080` |
| pgAdmin | `http://localhost:5050` |
| API health check | `http://localhost:8080/api/health` |

### What the Docker setup does

- Builds the Vite frontend and serves it through `nginx:1.27-alpine`
- Starts the API on port `3000` inside the Docker network
- Starts PostgreSQL 16
- Runs `npm run prisma:migrate:deploy` when the API container starts
- Exposes pgAdmin for database inspection

## Local development

Use this path if you want live frontend development with Vite and direct control of the API process.

### 1. Install dependencies

```bash
npm install
```

### 2. Provide a PostgreSQL connection

The local API reads `DATABASE_URL` from the shell environment. It does **not** load `.env` automatically, so export the variable before starting the API.

Example:

```bash
export DATABASE_URL="postgresql://nutrio:change_me_to_a_strong_password@localhost:5432/nutrio?schema=public"
```

### 3. Generate the Prisma client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

### 4. Start the API

```bash
npm run api:start
```

### 5. Start the frontend in another terminal

```bash
npm run dev
```

The Vite frontend runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `POSTGRES_DB` | Docker Compose | Database name for the PostgreSQL container |
| `POSTGRES_USER` | Docker Compose | Database user for the PostgreSQL container |
| `POSTGRES_PASSWORD` | Docker Compose | Database password for the PostgreSQL container |
| `PGADMIN_DEFAULT_EMAIL` | Docker Compose | Login email for pgAdmin |
| `PGADMIN_DEFAULT_PASSWORD` | Docker Compose | Login password for pgAdmin |
| `DATABASE_URL` | Local API and Prisma | Direct PostgreSQL connection string |

## First-run checklist

- Open the app and confirm the main screens `Today`, `Add`, and `Products`
- Create one product on the `Add` screen
- Log that product into any meal section on the `Today` screen
- Confirm `GET /api/health` returns `{ "status": "ok" }`

## Useful commands

```bash
npm run build
npm run prisma:generate
npm run prisma:migrate:deploy
```
