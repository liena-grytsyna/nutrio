# Nutrio

Nutrio is a simple calorie-tracking web app built as a practical school project. The idea is easy to understand:

1. save food products with nutrition values
2. store those products in a PostgreSQL database
3. add eaten amounts to a selected day
4. calculate calories, protein, fat, and carbs automatically
5. show a clear daily overview in a mobile-style interface

This README is written as a full and simple scenario for the assignment, so it can be used both as project documentation and as support for presentation, delivery, or exam preparation.

## 1. What This Assignment Is About

The assignment is to build a useful digital solution that solves a real everyday problem.

In this project, the problem is:

People often want to keep track of what they eat during the day, but many apps are too large, too complicated, or require too much setup. Nutrio focuses on the core workflow only:

- create a product
- save its nutrition data
- find that product later
- add the amount eaten to breakfast, lunch, dinner, or snacks
- see the daily total immediately

The project therefore combines:

- frontend development
- backend development
- database work
- user-centered design
- practical business logic

## 2. Very Simple Project Scenario

Here is the shortest possible explanation of how the app works:

A user opens Nutrio and wants to track food for today.

First, the user goes to the `Add` screen and creates a product, for example `Banana`, with calories and macronutrients per 100 grams. The product is saved to the PostgreSQL database through the API.

Then the user opens the `Products` screen and sees that the product is stored in the catalog. The user can search by name, brand, or barcode.

After that, the user opens the `Today` screen, chooses a meal section such as `Breakfast`, selects the saved product, writes how many grams were eaten, and adds it to the meal.

Nutrio then calculates the nutrition values for the chosen amount and updates the daily summary card. The meal is also saved through the API to PostgreSQL, so the day entries remain visible after refresh.

In short:

- product catalog = stored in PostgreSQL
- daily eating entries = stored in PostgreSQL
- totals = calculated automatically in the frontend

## 3. Full Step-by-Step User Scenario

This is the most detailed and simple scenario for demonstrating the assignment from start to finish.

### Step 1. Start the application

The user starts the project and opens the app in the browser.

The interface is designed like a mobile app and has three bottom tabs:

- `Today`
- `Add`
- `Products`

At the top there is a calendar. The user can switch days and see progress for each day.

### Step 2. Create a new product

The user opens the `Add` tab.

Here the user fills in:

- product name
- brand (optional)
- barcode (optional)
- serving size
- calories
- protein
- fat
- carbs

Example:

- Name: `Banana`
- Brand: `Bama`
- Barcode: `123456789`
- Serving: `100 g`
- Kcal: `89`
- Protein: `1.1`
- Fat: `0.3`
- Carbs: `22.8`

When the user presses `Save Product`, the frontend sends a `POST /api/products` request to the backend.

The backend:

- validates the input
- checks that required values exist
- saves the product with Prisma to PostgreSQL
- returns the created product to the frontend

If everything is correct, the screen shows `Product saved.`

### Step 3. Verify that the product exists

The user opens the `Products` tab.

This page loads products from the API with `GET /api/products`.

The user now sees the saved product in the catalog. If many products exist, the user can search by:

- name
- brand
- barcode

This proves that the API and database work correctly.

### Step 4. Go to the Today screen

The user opens the `Today` tab.

The screen contains:

- a nutrition summary card
- meal sections for the selected day
- a button to add products to a meal

The meal sections are:

- Breakfast
- Snack
- Lunch
- Second Snack
- Dinner
- Third Snack

At first, the selected day may have no entries. In that case, the app shows a message that no meals exist yet.

### Step 5. Add a saved product to a meal

The user presses `+` on one meal section, for example `Breakfast`.

A dialog opens.

Inside the dialog, the user can:

- search for a saved product
- choose a product from the list
- enter the amount in grams
- preview calories and macros for that amount

Example:

- Product: `Banana`
- Amount: `150 g`

The app recalculates the nutrition automatically:

- 89 kcal per 100 g becomes 133.5 kcal for 150 g
- protein, fat, and carbs are recalculated in the same way

When the user confirms, the entry is added to the selected meal.

### Step 6. See the updated daily summary

After adding the product, Nutrio updates the `Today` screen immediately.

The app now shows:

- the meal entry in the correct meal section
- updated daily calories
- updated daily protein
- updated daily fat
- updated daily carbs
- progress toward the daily target

This gives instant feedback to the user.

### Step 7. Save day entries in the database

Meal entries are stored in PostgreSQL through the backend API.

That means:

- refreshing the page does not remove the meal entries
- the data is loaded again from the server
- products and meal entries use one shared source of truth

This is useful because both the product catalog and the daily journal now follow the same persistence model.

### Step 8. Switch to another date

The user can choose another day in the top calendar.

When the date changes:

- the app filters meal entries for that day
- the day totals are recalculated
- the calendar shows daily calorie indicators

This demonstrates that the app handles daily tracking, not only a single static page.

### Step 9. Repeat the process with more products

The user can now repeat the whole flow:

1. create more products
2. search for them in the catalog
3. add them to different meals
4. compare totals between days

This is the complete practical scenario of the assignment.

## 4. Example Demonstration Script

If you need to present the project to a teacher, examiner, or class, you can use this exact order:

1. Open the app and explain that it is a calorie-tracking solution.
2. Show the three tabs: `Today`, `Add`, and `Products`.
3. Go to `Add` and create one product such as `Banana`.
4. Explain that this product is saved through the API to PostgreSQL.
5. Go to `Products` and show that the product appears in the list.
6. Use the search field to prove that filtering works.
7. Go to `Today` and choose a meal, for example `Breakfast`.
8. Add `Banana` with `150 g`.
9. Show that the nutrition preview updates before saving.
10. Save the entry and explain that the totals update automatically.
11. Refresh the page and show that the meal entry is still there because it is saved in PostgreSQL and loaded again from the API.
12. Change the date in the calendar and explain that entries are grouped by day.

If you want an even clearer demo, create two or three products first:

- Banana
- Oatmeal
- Yogurt

Then add them to:

- Breakfast
- Lunch
- Dinner

This makes the summary card more informative during the presentation.

## 5. What Is Implemented Right Now

The current project already includes these working features:

- mobile-style React interface
- daily tracking screen
- product creation form
- product list from the API
- product search by name, brand, or barcode
- adding products to meal sections
- automatic nutrition calculation for a chosen amount
- daily summary of calories, protein, fat, and carbs
- calendar with day selection
- visual daily calorie indicators
- PostgreSQL persistence for products
- PostgreSQL persistence for day entries
- Docker setup for frontend, API, database, and pgAdmin

## 6. What Is Not Finished Yet

It is important to describe the current scope honestly.

These parts are not finished or not connected yet:

- no authentication or user accounts
- no edit or delete for products
- no edit or delete for meal entries
- no shared cloud sync for daily entries
- no automated test suite is included yet

This is useful to mention in a school presentation, because it shows that you understand both what works and what could be improved.

## 7. System Architecture

The project is split into clear parts:

### Frontend

- `React 19`
- `TypeScript`
- `Vite`
- `SCSS`

Frontend responsibilities:

- render the user interface
- manage the current screen
- show calendar and meal sections
- call the backend API
- calculate and display daily totals
- load and save day entries through the backend API

### Backend

- `Node.js`
- `Express`
- `Prisma`

Backend responsibilities:

- receive API requests
- validate input
- save products
- fetch products
- save day entries
- fetch day entries
- connect safely to PostgreSQL

### Database

- `PostgreSQL`

Database responsibilities:

- store product catalog permanently
- store daily meal entries permanently
- keep nutrition values consistent
- support later extension of the app

### Infrastructure

- `Docker`
- `Docker Compose`
- `Nginx`
- `pgAdmin`

Infrastructure responsibilities:

- run the frontend in a container
- run the API in a container
- run PostgreSQL in a container
- make the project easy to start and demonstrate

## 8. Data Flow

The data flow is simple and good for explaining during an exam:

1. The user enters a product in the frontend form.
2. The frontend sends the product to `POST /api/products`.
3. The Express API validates the data.
4. Prisma writes the product to PostgreSQL.
5. The frontend requests products with `GET /api/products`.
6. The user selects a product and enters a gram amount.
7. The frontend calculates nutrition for that amount.
8. The frontend sends the meal entry to `POST /api/day-entries`.
9. PostgreSQL stores the day entry and the frontend updates totals for the selected day.

## 9. Main Screens

### `Today`

Purpose:

- track what the user ate on a chosen day
- display daily totals
- organize entries by meal section

Key elements:

- summary card
- meal cards
- add-entry dialog
- calendar

### `Add`

Purpose:

- create a new product and store it in the database

Key elements:

- product form
- validation
- save status message

### `Products`

Purpose:

- display the stored product catalog
- let the user search through saved products

Key elements:

- product search
- product list
- loading and empty states

## 10. Data Models

The database currently stores two main models: `Product` and `DayEntry`.

### `Product`

Fields:

- `id`
- `name`
- `brand`
- `barcode`
- `servingSize`
- `calories`
- `protein`
- `fat`
- `carbs`
- `createdAt`
- `updatedAt`

### `DayEntry`

Fields:

- `id`
- `name`
- `amount`
- `calories`
- `protein`
- `fat`
- `carbs`
- `source`
- `eatenAt`
- `createdAt`
- `updatedAt`

This split fits the MVP well: products are reusable nutrition references, and day entries are time-based records of what the user actually ate.

## 11. API Endpoints

### `GET /api/health`

Purpose:

- check whether the API can reach the database

### `GET /api/products`

Purpose:

- return saved products

Supports:

- optional search by query string

### `POST /api/products`

Purpose:

- create a new product

Requires:

- `name`
- `calories`
- `protein`
- `fat`
- `carbs`

Optional:

- `brand`
- `barcode`
- `servingSize`

### `GET /api/day-entries`

Purpose:

- return saved day entries

### `POST /api/day-entries`

Purpose:

- create a new day entry

Requires:

- `name`
- `amount`
- `calories`
- `protein`
- `fat`
- `carbs`
- `source`
- `eatenAt`

## 12. Project Structure

```text
nutrio/
  prisma/                    # Prisma schema and migrations
  server/                    # Express API
  src/
    app/                     # root app and layout
    features/                # domain logic: products, nutrition, navigation
    pages/                   # main screens
    shared/                  # shared lib, styles, and UI
    widgets/                 # larger reusable UI blocks
  Dockerfile                 # frontend image
  Dockerfile.api             # API image
  docker-compose.yml         # full container setup
  nginx.conf                 # frontend reverse proxy config
  README.md
```

This structure is good for a school project because it keeps UI, business logic, and backend responsibilities separate.

## 13. Technologies and Why They Were Chosen

### React

Used to build the interface as reusable components.

Why it fits:

- easy to split into screens and widgets
- easy to update UI when state changes
- common and relevant frontend technology

### TypeScript

Used for safer data handling.

Why it fits:

- helps avoid mistakes with nutrition values and product fields
- makes code easier to maintain

### Vite

Used as the frontend build tool.

Why it fits:

- quick development startup
- simple configuration
- good developer experience

### Express

Used to build the backend API.

Why it fits:

- simple REST endpoints
- good for small and medium student projects
- easy to explain in a presentation

### Prisma

Used as ORM between the API and PostgreSQL.

Why it fits:

- clear schema
- clean database access
- beginner-friendly compared with raw SQL only

### PostgreSQL

Used for persistent product storage.

Why it fits:

- reliable relational database
- good for structured data
- relevant and realistic backend skill

### Docker

Used to run the project more easily.

Why it fits:

- consistent environment
- easier demonstration on another machine
- practical industry-relevant tool

## 14. How to Run the Project

There are two realistic ways to run this project.

### Option A. Recommended: run the full project with Docker Compose

This is the easiest option for demonstration.

1. Create a local `.env` file from `.env.example`.
2. Adjust passwords if needed.
3. Start all containers:

```bash
docker compose up --build
```

4. Open the frontend:

```text
http://localhost:8080
```

5. Optional: open pgAdmin:

```text
http://localhost:5050
```

What starts in this mode:

- frontend container with Nginx
- API container with Express
- PostgreSQL container
- pgAdmin container

This mode is best for:

- project delivery
- teacher demonstration
- stable local setup

### Option B. Development mode

Use this if you want to work on the frontend with Vite and hot reload.

Important:

The frontend expects the API on `http://localhost:3000`, and the local API needs a valid `DATABASE_URL`.

Typical development flow:

1. Install dependencies:

```bash
npm install
```

2. Make sure PostgreSQL is available locally and `DATABASE_URL` is configured.

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run migrations:

```bash
npm run prisma:migrate:deploy
```

5. Start the API:

```bash
npm run api:start
```

6. In another terminal, start the frontend:

```bash
npm run dev
```

7. Open:

```text
http://localhost:5173
```

This mode is best for:

- active development
- editing React components
- quick UI feedback

## 15. Environment Variables

The `.env.example` file contains:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `PGADMIN_DEFAULT_EMAIL`
- `PGADMIN_DEFAULT_PASSWORD`

The API also needs:

- `DATABASE_URL`

In Docker Compose, `DATABASE_URL` is set automatically for the API container.

## 16. Where Data Is Stored

This is a very important detail for explaining the project clearly.

### Stored in PostgreSQL

- saved product catalog
- product nutrition values
- optional brand and barcode
- day meal entries
- selected day journal history

Why this is useful:

- products and day entries share one source of truth
- refreshing the UI does not depend on browser-local state
- the backend design is more consistent and easier to extend later

## 17. Good Points to Explain During Presentation

If you need to explain your technical choices simply, these points are strong:

- the app solves a real daily problem
- the workflow is small and focused, which makes the MVP realistic
- the frontend and backend are clearly separated
- the project uses a real relational database
- the app keeps one source of truth for both products and meal entries
- the app stores reusable product data centrally
- the calculation logic is automatic and practical
- the UI is mobile-oriented because food tracking is usually done on a phone

## 18. Limitations and Possible Improvements

Current limitations:

- no login
- no multi-user support
- no product editing
- no meal editing
- no delete flow
- no automated tests

Natural next improvements:

- edit and delete products
- edit and delete meal entries
- add user accounts
- add charts or weekly statistics
- add automated testing

## 19. Suggested Content for the Assignment Table

The screenshot shows a planning/reflection table. Below is simple material you can use directly or adapt.

### Tema i fagene / Praktiske aktiviteter

| Tema i fagene | Praktiske aktiviteter |
| --- | --- |
| Frontendutvikling | Lage et mobiltilpasset brukergrensesnitt i React med tre hovedskjermer: Today, Add og Products. Bruke komponenter, state, props og dialoger for å gjøre løsningen enkel å bruke. |
| Backend og API | Lage et Express-API som kan hente og lagre produkter. Validere input og sende tydelige svar tilbake til frontend. |
| Database og datamodellering | Modellere produktdata i Prisma og PostgreSQL med felter for navn, merke, strekkode, porsjonsstørrelse og næringsverdier. |
| Programmeringslogikk | Regne ut kalorier, protein, fett og karbohydrater ut fra hvor mange gram brukeren legger inn. Oppdatere dagssummen automatisk. |
| Brukeropplevelse | Lage en enkel arbeidsflyt der brukeren først lagrer produkter, deretter finner dem igjen og til slutt legger dem til i et måltid. |
| Testing og feilkontroll | Teste lagring, søk, visning av produkter, validering av skjema og kontrollere at data blir bevart etter oppfriskning av siden. |

### Læreplanmål (beskrivelse) / Relevans for eksamen

Below is not an official quote from a curriculum. It is a simple way to describe how the project connects to learning goals and exam relevance.

| Læreplanmål (beskrivelse) | Relevans for eksamen og hva legger du vekt på |
| --- | --- |
| Planlegge og utvikle en digital løsning ut fra et praktisk behov. | Prosjektet viser hvordan jeg går fra idé til fungerende løsning. Jeg legger vekt på at appen løser et tydelig hverdagsproblem på en enkel måte. |
| Lage brukervennlige grensesnitt og gode arbeidsflyter. | Jeg viser at brukeren kan forstå appen raskt: først opprette produkt, så finne produktet igjen, og til slutt registrere det i et måltid. |
| Bruke programmering til å behandle data og automatisere beregninger. | Jeg legger vekt på logikken som regner ut næringsverdier automatisk ut fra gram, og hvordan totalsummen oppdateres med en gang. |
| Bruke databaser og strukturert lagring i en digital løsning. | Jeg viser forskjellen mellom varig lagring i PostgreSQL og lokal lagring i nettleseren. Dette er viktig fordi det forklarer systemdesignet i prosjektet. |
| Dokumentere, vurdere og forbedre eget arbeid. | Jeg legger vekt på å kunne forklare hva som fungerer nå, hva som mangler, og hvilke forbedringer som er naturlige i neste versjon. |

## 20. Short Conclusion

Nutrio is a focused school project that demonstrates a complete full-stack workflow:

- a user interface in React
- a backend API in Express
- a database with PostgreSQL and Prisma
- practical calculation logic
- a realistic user scenario

The strength of the project is not that it does everything. The strength is that it does one clear job well:

store food products, add them to daily meals, and calculate nutrition in a simple and understandable way.
