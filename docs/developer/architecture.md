# Architecture

Nutrio uses a small client-server setup with minimal layers.

## System map

```text
React frontend
    |
    v
Nginx
    |
    v
Express API
    |
    v
Prisma + PostgreSQL
```

## Frontend

The frontend is responsible for:

- screen navigation
- product and overview requests
- creating and deleting day entries

It also stores a persistent `deviceId` in `localStorage` and sends `timezoneOffsetMinutes` with overview requests.

## Backend

The API is responsible for:

- health checks
- product creation and listing
- nutrition overview aggregation
- day entry creation and deletion

The nutrition logic converts product values from `per 100 g` into entry totals and compares the result with built-in daily targets.

## Core flow

1. The frontend sends requests to `/api`.
2. The API validates data and reads or writes through Prisma.
3. PostgreSQL stores products and day entries.
4. The frontend refreshes the visible totals.

## Main models

### `Product`

- name
- serving size
- calories
- protein
- fat
- carbs

### `DayEntry`

- copied product name
- amount in grams
- calculated nutrition values
- `deviceId`
- `eatenAt`

## Identity model

Nutrio does not use accounts. Data is separated by a browser-generated `deviceId`.

## Runtime services

The Docker setup runs four services:

- `frontend`
- `api`
- `db`
- `pgadmin`
