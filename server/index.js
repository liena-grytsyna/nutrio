import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

app.use(express.json({ limit: '1mb' }));

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const optionalText = (value) => text(value) || null;

const number = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const search = text(req.query.search);

    const products = await prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: { name: 'asc' },
      take: 100,
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', async (req, res, next) => {
  try {
    const name = text(req.body.name);
    const calories = number(req.body.calories);
    const protein = number(req.body.protein);
    const fat = number(req.body.fat);
    const carbs = number(req.body.carbs);

    if (!name || calories === null || protein === null || fat === null || carbs === null) {
      return res.status(400).json({
        error: 'Name and non-negative nutrition values are required.',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand: optionalText(req.body.brand),
        barcode: optionalText(req.body.barcode),
        servingSize: text(req.body.servingSize) || '100 g',
        calories,
        protein,
        fat,
        carbs,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
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

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Nutrio API listening on port ${port}`);
});
