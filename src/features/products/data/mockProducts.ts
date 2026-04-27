import type { DayEntry } from '../../nutrition/types';
import type { Product } from '../types';

function createDayTimestamp(dayOffset: number, hours: number, minutes = 0) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Greek Yogurt',
    servingSize: '100 g',
    calories: 73,
    protein: 10,
    fat: 2,
    carbs: 3.5,
  },
  {
    id: '2',
    name: 'Banana',
    servingSize: '100 g',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 22.8,
  },
];

export const mockEntries: DayEntry[] = [
  {
    id: '101',
    name: 'Oatmeal with Banana',
    amount: 320,
    calories: 312,
    protein: 24,
    fat: 8,
    carbs: 42,
    source: 'search',
    eatenAt: createDayTimestamp(0, 8, 30),
  },
  {
    id: '102',
    name: 'Chicken Salad',
    amount: 280,
    calories: 418,
    protein: 38,
    fat: 17,
    carbs: 18,
    source: 'manual',
    eatenAt: createDayTimestamp(0, 13, 0),
  },
  {
    id: '103',
    name: 'Protein Bar',
    amount: 75,
    calories: 298,
    protein: 15,
    fat: 10,
    carbs: 46,
    source: 'ocr',
    eatenAt: createDayTimestamp(0, 17, 45),
  },
  {
    id: '104',
    name: 'Omelet with Toast',
    amount: 240,
    calories: 356,
    protein: 21,
    fat: 19,
    carbs: 22,
    source: 'manual',
    eatenAt: createDayTimestamp(-1, 9, 15),
  },
  {
    id: '105',
    name: 'Cottage Cheese with Berries',
    amount: 180,
    calories: 214,
    protein: 19,
    fat: 6,
    carbs: 14,
    source: 'search',
    eatenAt: createDayTimestamp(-2, 7, 50),
  },
];
