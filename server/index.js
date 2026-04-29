import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

app.use(express.json({ limit: '1mb' }));

const PRODUCT_SOURCES = new Set(['manual', 'search']);
const dayEntrySelect = {
  id: true,
  name: true,
  amount: true,
  calories: true,
  protein: true,
  fat: true,
  carbs: true,
  source: true,
  eatenAt: true,
};

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalText(value) {
  return readText(value) || null;
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

function readProductSource(value) {
  const source = readText(value);
  return PRODUCT_SOURCES.has(source) ? source : null;
}

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

app.get('/api/products', async (req, res) => {
  const search = readText(req.query.search);
  const where = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
    : undefined;

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 100,
  });

  res.json({ products });
});

app.get('/api/day-entries', async (_req, res) => {
  const dayEntries = await prisma.dayEntry.findMany({
    select: dayEntrySelect,
    orderBy: [{ eatenAt: 'asc' }, { createdAt: 'asc' }],
    take: 1000,
  });

  res.json({ dayEntries });
});

app.post('/api/products', async (req, res) => {
  const name = readText(req.body.name);
  const calories = readNonNegativeNumber(req.body.calories);
  const protein = readNonNegativeNumber(req.body.protein);
  const fat = readNonNegativeNumber(req.body.fat);
  const carbs = readNonNegativeNumber(req.body.carbs);

  if (!name || calories === null || protein === null || fat === null || carbs === null) {
    res.status(400).json({
      error: 'Name and non-negative nutrition values are required.',
    });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name,
      brand: readOptionalText(req.body.brand),
      barcode: readOptionalText(req.body.barcode),
      servingSize: readText(req.body.servingSize) || '100 g',
      calories,
      protein,
      fat,
      carbs,
    },
  });

  res.status(201).json({ product });
});

app.post('/api/day-entries', async (req, res) => {
  const name = readText(req.body.name);
  const amount = readNonNegativeNumber(req.body.amount);
  const calories = readNonNegativeNumber(req.body.calories);
  const protein = readNonNegativeNumber(req.body.protein);
  const fat = readNonNegativeNumber(req.body.fat);
  const carbs = readNonNegativeNumber(req.body.carbs);
  const source = readProductSource(req.body.source);
  const eatenAt = readDate(req.body.eatenAt);

  if (
    !name ||
    amount === null ||
    calories === null ||
    protein === null ||
    fat === null ||
    carbs === null ||
    !source ||
    !eatenAt
  ) {
    res.status(400).json({
      error: 'Day entry requires valid name, amount, nutrition values, source, and eatenAt.',
    });
    return;
  }

  const dayEntry = await prisma.dayEntry.create({
    data: {
      name,
      amount,
      calories,
      protein,
      fat,
      carbs,
      source,
      eatenAt,
    },
    select: dayEntrySelect,
  });

  res.status(201).json({ dayEntry });
});

app.use((error, _req, res, _next) => {
  if (error?.code === 'P2002') {
    return res.status(409).json({
      error: 'Product with this unique value already exists.',
    });
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
});

async function disconnectAndExit() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', disconnectAndExit);
process.on('SIGTERM', disconnectAndExit);

app.listen(port, () => {
  console.log(`Nutrio API listening on port ${port}`);
});
