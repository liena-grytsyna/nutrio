---
hide:
  - toc
---

<div class="hero">
  <div>
    <span class="section-label">Nutrition tracker documentation</span>
    <h1>Nutrio</h1>
    <p>
      Nutrio is a lightweight food tracking app for daily calories and macros.
      The docs are split into a user path and a developer path.
    </p>
    <a class="md-button md-button--primary" href="user/">For Users</a>
    <a class="md-button" href="developer/">For Developers</a>
  </div>
  <div class="hero__panel">
    <p><strong>At a glance</strong></p>
    <ul>
      <li>Add reusable food products</li>
      <li>Log meals by section and amount</li>
      <li>Track calories, protein, fat, and carbs</li>
      <li>Separate data per browser with a generated <code>deviceId</code></li>
      <li>Run locally with Docker or a local PostgreSQL instance</li>
    </ul>
    <p><strong>Stack</strong></p>
    <p><code>React 19</code> <code>TypeScript</code> <code>Vite</code> <code>Express 5</code> <code>Prisma</code> <code>PostgreSQL</code> <code>Docker</code> <code>Nginx</code></p>
  </div>
</div>

<div class="metric-strip">
  <div class="metric">
    <strong>3</strong>
    <span>main screens in the app</span>
  </div>
  <div class="metric">
    <strong>6</strong>
    <span>meal sections per day</span>
  </div>
  <div class="metric">
    <strong>100</strong>
    <span>products returned per API call</span>
  </div>
  <div class="metric">
    <strong>1000</strong>
    <span>day entries fetched per overview request</span>
  </div>
</div>

## What Nutrio covers

<div class="feature-grid">
  <div class="feature-card">
    <h3>Product catalog</h3>
    <p>
      Save food items once, including serving size and nutrition values per 100
      grams. The app then reuses those products when logging meals.
    </p>
  </div>
  <div class="feature-card">
    <h3>Daily meal logging</h3>
    <p>
      Organize entries into breakfast, snack, lunch, second snack, dinner, and
      late snack sections without building a full scheduling system.
    </p>
  </div>
  <div class="feature-card">
    <h3>Nutrition summary</h3>
    <p>
      Aggregate daily totals and compare them with built-in targets for
      calories and macronutrients.
    </p>
  </div>
  <div class="feature-card">
    <h3>Simple infrastructure</h3>
    <p>
      Run the frontend through Nginx, the API through Node.js, and store all
      persistent data in PostgreSQL using Prisma migrations.
    </p>
  </div>
</div>

## Choose your path

<div class="feature-grid">
  <div class="feature-card">
    <h3>For users</h3>
    <p>
      Start with <a href="user/">User Guide</a> if you want to use
      Nutrio as an app: create products, log meals, inspect totals, and fix
      mistakes.
    </p>
  </div>
  <div class="feature-card">
    <h3>For developers</h3>
    <p>
      Start with <a href="developer/">Developer Guide</a> if you
      need local setup, architecture, API details, deployment notes, or
      troubleshooting.
    </p>
  </div>
</div>

!!! note "Current product scope"
    Nutrio intentionally keeps scope small. There is no account system, no multi-user collaboration, and no external nutrition database integration in the current implementation.
