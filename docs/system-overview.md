# System Overview

## Architecture

Nutrio uses a client-server architecture.

- Frontend (React)
- Backend (Node.js + Express)
- Database (PostgreSQL)

---

## How it works

1. User interacts with frontend
2. Frontend sends requests to backend API
3. Backend processes data
4. Data is stored in database
5. Response is sent back to frontend
6. UI updates automatically

---

## Device ID

Each user is identified by a deviceId stored in the browser.

This ensures:
- Data is separated per user
- No login is required

---

## Docker

The application runs in Docker containers:

- frontend
- backend
- database
- nginx

This ensures consistent environment.
