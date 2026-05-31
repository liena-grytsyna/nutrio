---
hide:
  - toc
---

<div class="hero">
  <div>
    <span class="section-label">Overview</span>
    <h1>Nutrio</h1>
    <p>
      Nutrio is a small food tracking app for logging meals, checking daily
      calories and macros, and keeping data separated per browser.
    </p>
    <p>
      This documentation is split into two paths: one for people who use the
      app and one for people who build or maintain it.
    </p>
  </div>
  <div class="hero__panel">
    <p><strong>What Nutrio does</strong></p>
    <ul>
      <li>stores reusable food products</li>
      <li>logs meals by amount and day section</li>
      <li>shows daily calories, protein, fat, and carbs</li>
      <li>runs on React, Express, and PostgreSQL</li>
    </ul>
  </div>
</div>

## Choose a guide

<div class="feature-grid">
  <div class="feature-card">
    <h3>User Guide</h3>
    <p>
      Open this if you want to use Nutrio: create products, log meals, review
      totals, and remove mistakes.
    </p>
    <p><a class="md-button md-button--primary" href="user/">Open User Guide</a></p>
  </div>
  <div class="feature-card">
    <h3>Developer Guide</h3>
    <p>
      Open this if you need setup, architecture, API details, deployment, or
      troubleshooting.
    </p>
    <p><a class="md-button" href="developer/">Open Developer Guide</a></p>
  </div>
</div>

## App structure

<div class="feature-grid">
  <div class="feature-card">
    <h3>Today</h3>
    <p>
      Review the selected day, add meal entries, and check the nutrition
      summary.
    </p>
  </div>
  <div class="feature-card">
    <h3>Add</h3>
    <p>
      Create food products with serving size, calories, protein, fat, and
      carbs.
    </p>
  </div>
  <div class="feature-card">
    <h3>Products</h3>
    <p>
      Browse saved products and quickly compare nutrition values before logging
      a meal.
    </p>
  </div>
  <div class="feature-card">
    <h3>Backend</h3>
    <p>
      The API stores products and entries, groups data by day, and returns the
      overview used by the frontend.
    </p>
  </div>
</div>

## Stack

`React 19` `TypeScript` `Vite` `Express 5` `Prisma` `PostgreSQL` `Docker` `Nginx`
