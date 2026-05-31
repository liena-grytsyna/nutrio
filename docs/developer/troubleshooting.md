# Troubleshooting

This page focuses on the most likely operational and development issues in the current Nutrio setup.

## `DATABASE_URL is required`

### Symptom

The API process exits immediately on startup.

### Cause

The local API expects `DATABASE_URL` to exist in the shell environment.

### Fix

```bash
export DATABASE_URL="postgresql://nutrio:change_me_to_a_strong_password@localhost:5432/nutrio?schema=public"
npm run api:start
```

## `GET /api/health` returns `503`

### Symptom

The API is reachable, but the health endpoint reports:

```json
{
  "status": "error"
}
```

### Cause

The API could not reach PostgreSQL.

### Fix

- verify the database container or local PostgreSQL instance is running
- verify credentials in `DATABASE_URL`
- inspect API logs for Prisma or connection errors

## Frontend loads but API calls fail with `502`

### Symptom

The UI opens, but product or overview requests fail behind Nginx.

### Cause

The frontend container is alive, but the API container is down or unhealthy.

### Fix

- run `docker compose ps`
- inspect the API container logs
- confirm the API health check passes
- confirm database migrations did not fail during container startup

## Data appears missing in another browser

### Symptom

You created products or entries before, but another browser or private window shows an empty state.

### Cause

Nutrio separates data by the browser-generated `deviceId`.

### Fix

- use the same browser profile where the data was created
- avoid clearing `localStorage` if you want to keep the same local identity
- move to a real account system if cross-device continuity is required

## Entries show up on the wrong calendar day

### Symptom

An entry looks shifted into the previous or next day.

### Cause

The overview is grouped using the browser-provided `timezoneOffsetMinutes`.

### Fix

- verify the system timezone on the client device
- verify the client clock is correct
- recreate the request and inspect the `timezoneOffsetMinutes` query value

## Prisma migrations fail on startup

### Symptom

The API container restarts repeatedly or the local `prisma:migrate:deploy` command fails.

### Cause

The database may be unavailable, credentials may be wrong, or a previous schema state may conflict with the current migrations.

### Fix

- verify PostgreSQL connectivity first
- inspect the exact Prisma error message
- confirm the target database is the expected one
- run `npm run prisma:generate` again if the Prisma client is stale

## Product creation fails with `400`

### Symptom

The app refuses to save a new product.

### Cause

One or more required nutrition fields are empty or invalid.

### Fix

- provide a non-empty name
- provide non-negative numeric values for calories, protein, fat, and carbs
- keep the serving label if you do not need a custom one
