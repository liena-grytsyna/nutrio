import type { DayEntry, Product } from '../types/nutrition';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Греческий йогурт',
    servingSize: '100 г',
    calories: 73,
    protein: 10,
    fat: 2,
    carbs: 3.5,
  },
  {
    id: '2',
    name: 'Банан',
    servingSize: '100 г',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 22.8,
  },
];

export const mockEntries: DayEntry[] = [
  {
    id: '101',
    name: 'Греческий йогурт',
    amount: 150,
    calories: 109.5,
    protein: 15,
    fat: 3,
    carbs: 5.25,
    source: 'search',
    eatenAt: new Date().toISOString(),
  },
  {
    id: '102',
    name: 'Банан',
    amount: 120,
    calories: 106.8,
    protein: 1.32,
    fat: 0.36,
    carbs: 27.36,
    source: 'manual',
    eatenAt: new Date().toISOString(),
  },
];
