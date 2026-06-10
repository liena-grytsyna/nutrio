# API Reference

Base URL: `/api`

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check API and database availability |
| `GET` | `/products` | List saved products |
| `POST` | `/products` | Create a product |
| `GET` | `/nutrition-overview` | Return day-grouped totals for one `deviceId` |
| `POST` | `/day-entries` | Create a logged food entry |
| `DELETE` | `/day-entries/:id` | Delete a logged food entry |

## `GET /health`

- success: HTTP `200` with `{ "status": "ok" }`
- failure: HTTP `503` with `{ "status": "error" }`

## `GET /products`

- returns up to `100` products ordered by name
- response shape: `{ "products": [...] }`

Example item:

```json
{
  "id": "cm123...",
  "name": "Banana",
  "servingSize": "100 g",
  "calories": 89,
  "protein": 1.1,
  "fat": 0.3,
  "carbs": 22.8
}
```

## `POST /products`

Request body:

```json
{
  "name": "Banana",
  "servingSize": "100 g",
  "calories": 89,
  "protein": 1.1,
  "fat": 0.3,
  "carbs": 22.8
}
```

Rules:

- `name` is required
- nutrition values must be non-negative numbers
- `servingSize` defaults to `100 g`

Success: HTTP `201` with `{ "product": ... }`

## `GET /nutrition-overview`

Query parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `deviceId` | Yes | Browser identity key |
| `timezoneOffsetMinutes` | Yes | Used for day grouping |

Example request:

```bash
curl "http://localhost:3000/api/nutrition-overview?deviceId=demo-device&timezoneOffsetMinutes=-120"
```

Response shape:

- `overview.days` contains grouped entries by date key
- `overview.dailyCalorieIndicators` contains calendar indicators
- `overview.defaultDay` and `overview.defaultIndicator` are fallbacks

Failure cases:

- HTTP `400` when `deviceId` is missing
- HTTP `400` when `timezoneOffsetMinutes` is invalid

## `POST /day-entries`

Request body:

```json
{
  "productId": "cm123...",
  "amount": 125,
  "eatenAt": "2026-05-31T08:00:00.000Z",
  "deviceId": "demo-device"
}
```

Rules:

- `productId`, `amount`, `eatenAt`, and `deviceId` are required
- `amount` must be non-negative
- `eatenAt` must be a valid date

Success: HTTP `201` with `{ "dayEntry": ... }`

Failure cases:

- HTTP `400` for invalid input
- HTTP `404` if the product does not exist

## `DELETE /day-entries/:id`

Deletes one stored day entry.

Success: HTTP `204 No Content`

## Generic server error

Unexpected failures return HTTP `500` with:

```json
{
  "error": "Internal server error."
}
```
