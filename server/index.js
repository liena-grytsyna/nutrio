import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  buildNutritionOverview,
  getProductNutritionForAmount,
} from "./nutrition.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

app.use(express.json({ limit: "1mb" }));
const dayEntrySelect = {
  id: true,
  name: true,
  amount: true,
  calories: true,
  protein: true,
  fat: true,
  carbs: true,
  eatenAt: true,
};

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readNonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function readDate(value) {
  const text = readText(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
}

function readInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function readDeviceId(value) {
  return readText(value);
}

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error" });
  }
});

app.get("/api/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    take: 100,
  });

  res.json({ products });
});

app.get("/api/nutrition-overview", async (req, res) => {
  const timezoneOffsetMinutes = readInteger(req.query.timezoneOffsetMinutes);
  const deviceId = readDeviceId(req.query.deviceId);

  if (timezoneOffsetMinutes === null) {
    res.status(400).json({
      error: "timezoneOffsetMinutes must be a valid integer.",
    });
    return;
  }

  if (!deviceId) {
    res.status(400).json({ error: "deviceId is required." });
    return;
  }

  const dayEntries = await prisma.dayEntry.findMany({
    select: dayEntrySelect,
    where: { deviceId },
    orderBy: [{ eatenAt: "asc" }, { createdAt: "asc" }],
    take: 1000,
  });

  res.json({
    overview: buildNutritionOverview(dayEntries, timezoneOffsetMinutes),
  });
});

app.post("/api/products", async (req, res) => {
  const name = readText(req.body.name);
  const calories = readNonNegativeNumber(req.body.calories);
  const protein = readNonNegativeNumber(req.body.protein);
  const fat = readNonNegativeNumber(req.body.fat);
  const carbs = readNonNegativeNumber(req.body.carbs);

  if (
    !name ||
    calories === null ||
    protein === null ||
    fat === null ||
    carbs === null
  ) {
    res.status(400).json({
      error: "Name and non-negative nutrition values are required.",
    });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name,
      servingSize: readText(req.body.servingSize) || "100 g",
      calories,
      protein,
      fat,
      carbs,
    },
  });

  res.status(201).json({ product });
});

app.post("/api/day-entries", async (req, res) => {
  const productId = readText(req.body.productId);
  const amount = readNonNegativeNumber(req.body.amount);
  const eatenAt = readDate(req.body.eatenAt);
  const deviceId = readDeviceId(req.body.deviceId);

  if (!productId || amount === null || !eatenAt || !deviceId) {
    res.status(400).json({
      error: "Day entry requires valid productId, amount, and eatenAt.",
    });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    res.status(404).json({
      error: "Selected product was not found.",
    });
    return;
  }

  const nutrition = getProductNutritionForAmount(product, amount);

  const dayEntry = await prisma.dayEntry.create({
    data: {
      name: product.name,
      amount,
      ...nutrition,
      eatenAt,
      deviceId,
    },
    select: dayEntrySelect,
  });

  res.status(201).json({ dayEntry });
});

app.use((error, _req, res, _next) => {
  if (error?.code === "P2002") {
    return res.status(409).json({
      error: "Product with this unique value already exists.",
    });
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});


async function disconnectAndExit() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", disconnectAndExit);
process.on("SIGTERM", disconnectAndExit);

app.listen(port, () => {
  console.log(`Nutrio API listening on port ${port}`);
});
