# Nutrio

Nutrio is a lightweight food tracking app for adding food products, logging meals, and viewing daily nutrition totals. It helps users keep a simple overview of calories, protein, fat, and carbohydrates for the current day.

## Live Preview

https://nutrio.it4.iktim.no/

## Technologies Used

- React
- TypeScript
- Vite
- Sass modules
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker
- Nginx

## Getting Started

### Clone the repository

```bash
git clone https://github.com/liena-grytsyna/nutrio.git
cd nutrio
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root. You can use `.env.example` as a starting point:

```bash
cp .env.example .env
```

The Docker setup uses these values for PostgreSQL, the API, and pgAdmin.

### Run with Docker

```bash
docker-compose up --build
```

After the containers start, open:

- App: http://localhost:8080
- pgAdmin: http://localhost:5050

### Run locally for development

Start PostgreSQL first and make sure `DATABASE_URL` is available in your environment.

Generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

Start the API:

```bash
npm run api:start
```

In another terminal, start the frontend:

```bash
npm run dev
```

The Vite dev server runs at http://localhost:5173 and proxies API requests to http://localhost:3000.

## Features

- Add food products with nutrition values.
- Log food entries by amount and time.
- View daily calorie and macronutrient totals.
- Separate entries per device using a generated browser device ID.
- Responsive mobile-first interface.

## Useful Commands

```bash
npm run build
npx prisma validate
```
