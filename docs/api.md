# API Reference

Base URL: `/api`

## Endpoint summary

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check API and database availability |
| `GET` | `/products` | List saved products |
| `POST` | `/products` | Create a new product |
| `GET` | `/nutrition-overview` | Return day-grouped nutrition totals |
| `POST` | `/day-entries` | Create a logged food entry |
| `DELETE` | `/day-entries/:id` | Delete a logged food entry |

## `GET /health`

Checks whether the API can reach the database.

### Success response

```json
{
  "status": "ok"
}
```

### Failure response

```json
{
  "status": "error"
}
```

The failure status is returned with HTTP `503`.

## `GET /products`

Returns up to `100` products ordered by name.

### Response

```json
{
  "products": [
    {
      "id": "cm123...",
      "name": "Banana",
      "servingSize": "100 g",
      "calories": 89,
      "protein": 1.1,
      "fat": 0.3,
      "carbs": 22.8,
      "createdAt": "2026-05-31T08:00:00.000Z",
      "updatedAt": "2026-05-31T08:00:00.000Z"
    }
  ]
}
```

## `POST /products`

Creates a reusable food product.

### Request body

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

### Validation rules

- `name` is required
- `calories`, `protein`, `fat`, and `carbs` must be non-negative numbers
- `servingSize` is optional and defaults to `100 g`

### Success response

Returns HTTP `201` and the created `product`.

## `GET /nutrition-overview`

Returns entries grouped by day for the current browser identity.

### Query parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `deviceId` | Yes | Browser-specific identity key |
| `timezoneOffsetMinutes` | Yes | Client timezone offset used for date grouping |

### Example request

```bash
curl "http://localhost:3000/api/nutrition-overview?deviceId=demo-device&timezoneOffsetMinutes=-120"
```

### Success response shape

```json
{
  "overview": {
    "days": {
      "2026-05-31": {
        "entries": [],
        "totals": {
          "calories": 0,
          "protein": 0,
          "fat": 0,
          "carbs": 0
        },
        "summary": {
          "consumed": {
            "calories": 0,
            "protein": 0,
            "fat": 0,
            "carbs": 0
          },
          "target": {
            "calories": 1600,
            "protein": 120,
            "fat": 53,
            "carbs": 160
          },
          "remaining": {
            "calories": 1600,
            "protein": 120,
            "fat": 53,
            "carbs": 160
          },
          "progress": {
            "calories": 0,
            "protein": 0,
            "fat": 0,
            "carbs": 0
          },
          "calorieStatus": "under",
          "calorieProgressRatio": 0
        }
      }
    },
    "dailyCalorieIndicators": {
      "2026-05-31": {
        "calories": 0,
        "progress": 0,
        "status": "under"
      }
    },
    "defaultDay": {
      "entries": [],
      "totals": {
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0
      },
      "summary": {
        "consumed": {
          "calories": 0,
          "protein": 0,
          "fat": 0,
          "carbs": 0
        },
        "target": {
          "calories": 1600,
          "protein": 120,
          "fat": 53,
          "carbs": 160
        },
        "remaining": {
          "calories": 1600,
          "protein": 120,
          "fat": 53,
          "carbs": 160
        },
        "progress": {
          "calories": 0,
          "protein": 0,
          "fat": 0,
          "carbs": 0
        },
        "calorieStatus": "under",
        "calorieProgressRatio": 0
      }
    },
    "defaultIndicator": {
      "calories": 0,
      "progress": 0,
      "status": "under"
    }
  }
}
```

### Failure responses

- HTTP `400` when `deviceId` is missing
- HTTP `400` when `timezoneOffsetMinutes` is not a valid integer

## `POST /day-entries`

Creates a logged meal entry from a saved product.

### Request body

```json
{
  "productId": "cm123...",
  "amount": 125,
  "eatenAt": "2026-05-31T08:00:00.000Z",
  "deviceId": "demo-device"
}
```

### Validation rules

- `productId` is required
- `amount` must be a non-negative number
- `eatenAt` must be a valid date string
- `deviceId` is required

### Success response

Returns HTTP `201` and the created `dayEntry`.

### Failure responses

- HTTP `400` for invalid request data
- HTTP `404` if the product does not exist

## `DELETE /day-entries/:id`

Deletes a stored day entry by its ID.

### Example request

```bash
curl -X DELETE "http://localhost:3000/api/day-entries/cm456..."
```

### Success response

Returns HTTP `204 No Content`.

## Generic server errors

Unexpected failures return HTTP `500` with:

```json
{
  "error": "Internal server error."
}
```
