# Nutrio

A simple starter project for a calorie tracking app.

## Step 1. What We Are Building Now

At this stage, we are preparing only the project foundation:

- set up `React + TypeScript + Vite`
- create a clear folder structure
- split the code into `app`, `components`, `screens`, `logic`, `ocr`, `storage`
- build a simple starter web page for iPhone Safari

This is not the final app yet, but a clean foundation for the MVP.

## Step 2. Why This Stack

- `React` is easy to use for the web version
- `TypeScript` helps keep product and macro data consistent
- `Vite` is beginner-friendly and starts quickly
- the business logic can later be moved into `React Native / Expo`

## Step 3. Project Structure

```text
src/
  api/           // future backend requests
  app/           // root App and application layout
  components/    // reusable UI components
  data/          // temporary mock data
  logic/         // calorie and macro calculations
  ocr/           // OCR and nutrition text parsing
  screens/       // application screens
  storage/       // local data storage
  styles/        // Sass tokens, mixins, and global styles
  types/         // product and nutrition types
  main.tsx
```

## Step 4. How to Run the Project

```bash
npm install
npm run dev
```

After that, open the address shown by Vite in your browser.

For iPhone testing, it is easiest to run the project on the same network and later add access via local IP.

## Step 5. What Is Already Included

- starter mobile-style interface
- styles split into `scss` files
- screens:
  - `Today`
  - `Add Product`
  - `Product List`
- daily totals calculation
- local storage scaffold via `localStorage`
- OCR text parsing scaffold for package labels

## Step 6. Next Step

The next step can be building the actual MVP:

1. a manual product entry form
2. saving to `localStorage`
3. daily calorie and macro totals
4. basic OCR with `Tesseract.js`
