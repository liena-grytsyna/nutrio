Nutrio
======

Lightweight food tracking app (MVP) for adding products, creating day entries, and viewing daily nutrition summaries.

Tech stack
----------
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL (Prisma ORM)
- Docker for local development

Simple MVP flow
---------------
1. Add product → 2. Add entry (select product, amount, time) → 3. See daily summary (totals & progress)

Setup (Docker)
--------------
1. Create a `.env` file in the project root with the required environment variables (see below).
2. Build and start containers:

	docker-compose up --build

3. The frontend is served by the Vite build or the static server in the container. The API listens on the configured PORT (default 3000).

Required environment variables
------------------------------
- DATABASE_URL  — PostgreSQL connection string (e.g. postgres://user:pass@host:5432/dbname)
- PORT (optional) — API port (defaults to 3000)

Main API endpoints
------------------
- GET  /api/health               — health check
- GET  /api/products             — list products
- POST /api/products             — create product (name, calories, protein, fat, carbs, servingSize)
- POST /api/day-entries          — create a day entry (productId, amount, eatenAt)
- GET  /api/nutrition-overview   — get aggregated per-day nutrition overview (requires timezoneOffsetMinutes query param)

Notes / removed features
------------------------
This submission focuses on the MVP. Previously considered or removed fields/endpoints such as brand, barcode, source, and the preview endpoint are intentionally not part of the MVP and are not required for the exam.

Build & validate (exam checklist)
--------------------------------
After setting `.env` and starting services (or from a local dev environment), run:

1. npm run build
2. npx prisma validate

Keep the project small and focused for the exam: no UI/UX changes or new features are included in this submission.
