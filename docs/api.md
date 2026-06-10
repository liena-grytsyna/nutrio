# API Documentation

## Base URL

/api

---

## Health check

GET /api/health

Returns status of backend and database.

---

## Get nutrition overview

GET /api/nutrition-overview?deviceId=...

Returns daily summary and entries.

---

## Create food entry

POST /api/day-entries

Body:

{
  "productId": "...",
  "amount": 100,
  "mealType": "breakfast",
  "deviceId": "..."
}

---

## Delete food entry

DELETE /api/day-entries/:id?deviceId=...

Deletes a food entry for the current device.
