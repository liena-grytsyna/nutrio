# Troubleshooting

## API returns 502

Problem:
- Backend is not reachable

Solution:
- Check if backend container is running
- Check Nginx configuration
- Check logs

---

## Data not updating

Problem:
- UI does not refresh

Solution:
- Reload page
- Check frontend console

---

## Database connection error

Problem:
- Backend cannot connect to database

Solution:
- Check DATABASE_URL
- Check if PostgreSQL is running

---

## Grafana shows DOWN

Problem:
- Health endpoint is failing

Solution:
- Check /api/health
- Restart backend
