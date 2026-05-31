# Architecture

Nutrio is intentionally small. The architecture favors a low operational footprint and a short request path over abstraction-heavy layering.

## System map

```text
Browser UI (React + Vite)
        |
        v
Nginx reverse proxy
        |
        v
Express API
        |
        v
Prisma + PostgreSQL
```

## Frontend responsibilities

The frontend is a React 19 application with three primary responsibilities:

- manage screen navigation between `Today`, `Add`, and `Products`
- fetch products and nutrition overview data from the API
- create and delete day entries, then refresh the visible daily summary

Important client-side behaviors:

- a persistent `deviceId` is created in `localStorage`
- the selected date is grouped locally and rendered through the calendar
- the frontend sends `timezoneOffsetMinutes` when loading the nutrition overview

## Backend responsibilities

The Express API handles:

- health checks
- product creation and listing
- nutrition overview aggregation
- day entry creation
- day entry deletion

The backend also contains the nutrition calculation logic:

- converts product nutrition values from `per 100 g` into entry totals
- aggregates totals per day
- compares totals with built-in daily targets
- calculates under / ideal / over calorie status

## Request flow

### Product creation

1. The user submits the `Add` form.
2. The frontend sends `POST /api/products`.
3. The API validates input and creates the product through Prisma.
4. The new product becomes available for later meal logging.

### Daily overview

1. The frontend sends `GET /api/nutrition-overview`.
2. The request includes `deviceId` and `timezoneOffsetMinutes`.
3. The API loads matching day entries from PostgreSQL.
4. The API groups entries into day buckets and computes totals.
5. The frontend renders the summary card and meal sections.

### Day entry creation

1. The user picks a product and amount.
2. The frontend sends `POST /api/day-entries`.
3. The API looks up the product, calculates entry nutrition, and stores a new row.
4. The frontend refreshes the overview.

## Data model

### `Product`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Prisma `cuid()` |
| `name` | `String` | Product name |
| `servingSize` | `String` | Defaults to `100 g` |
| `calories` | `Float` | Per 100 g |
| `protein` | `Float` | Per 100 g |
| `fat` | `Float` | Per 100 g |
| `carbs` | `Float` | Per 100 g |

### `DayEntry`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Prisma `cuid()` |
| `name` | `String` | Copied from the product at entry creation time |
| `amount` | `Float` | Amount in grams |
| `calories` | `Float` | Calculated for the selected amount |
| `protein` | `Float` | Calculated for the selected amount |
| `fat` | `Float` | Calculated for the selected amount |
| `carbs` | `Float` | Calculated for the selected amount |
| `deviceId` | `String` | Browser-scoped identity |
| `eatenAt` | `DateTime` | Timestamp used for day grouping |

## Identity model

!!! warning "No account system"
    Browser storage is the current identity boundary. If `localStorage` is cleared or a different browser is used, the app behaves like a different user.

This model is simple and frictionless, but it also means:

- data portability is limited
- there is no password recovery or account ownership
- user separation depends on the browser-generated identifier

## Container topology

The Docker setup runs four services:

| Service | Role |
| --- | --- |
| `frontend` | Builds the Vite app and serves static assets through Nginx |
| `api` | Runs Prisma migrations and starts the Express server |
| `db` | PostgreSQL data store |
| `pgadmin` | Optional database administration UI |
