import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});
const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json({ limit: '1mb' }));

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalText(value) {
  const text = normalizeText(value);
  return text.length > 0 ? text : null;
}

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function toProductResponse(product) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    barcode: product.barcode,
    servingSize: product.servingSize,
    calories: product.calories,
    protein: product.protein,
    fat: product.fat,
    carbs: product.carbs,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

app.get('/api/health', async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ status: 'ok' });
  } catch {
    response.status(503).json({ status: 'error' });
  }
});

app.get('/api/products', async (request, response, next) => {
  try {
    const search = normalizeText(request.query.search);
    const products = await prisma.product.findMany({
      where:
        search.length > 0
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : undefined,
      orderBy: {
        name: 'asc',
      },
      take: 100,
    });

    response.json({ products: products.map(toProductResponse) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', async (request, response, next) => {
  try {
    const body = request.body ?? {};
    const name = normalizeText(body.name);
    const servingSize = normalizeText(body.servingSize) || '100 g';
    const calories = normalizeNumber(body.calories);
    const protein = normalizeNumber(body.protein);
    const fat = normalizeNumber(body.fat);
    const carbs = normalizeNumber(body.carbs);

    if (!name || calories === null || protein === null || fat === null || carbs === null) {
      response.status(400).json({
        error: 'Product name and non-negative nutrition values are required.',
      });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand: normalizeOptionalText(body.brand),
        barcode: normalizeOptionalText(body.barcode),
        servingSize,
        calories,
        protein,
        fat,
        carbs,
      },
    });

    response.status(201).json({ product: toProductResponse(product) });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  if (error?.code === 'P2002') {
    response.status(409).json({ error: 'Product with this unique value already exists.' });
    return;
  }

  console.error(error);
  response.status(500).json({ error: 'Internal server error.' });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Nutrio API listening on port ${port}`);
});
