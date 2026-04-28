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
