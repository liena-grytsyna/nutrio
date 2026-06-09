# Troubleshooting

Common issues in the current Nutrio setup.

| Problem | What to check |
| --- | --- |
| `DATABASE_URL is required` | Export `DATABASE_URL` before starting the local API |
| `/api/health` returns `503` | PostgreSQL is running and credentials are correct |
| Frontend shows `502` for API calls | API container is running and passed its health check |
| Data is missing in another browser | Nutrio separates data by browser `deviceId` |
| Entries appear on the wrong day | Client timezone and clock are correct |
| Prisma migrations fail | Database connectivity and migration target are correct |
| Product creation returns `400` | Required nutrition fields are filled with valid numbers |

## Example fix for local API startup

```bash
export DATABASE_URL="postgresql://nutrio:change_me_to_a_strong_password@localhost:5432/nutrio?schema=public"
npm run api:start
```
