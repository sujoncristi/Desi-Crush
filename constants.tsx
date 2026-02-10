
import { FoodType, Level } from './types.ts';

export const GRID_SIZE = 8;

export const FOOD_CONFIG: Record<FoodType, { icon: string, color: string, shadow: string, name: string, nameBn: string }> = {
  BHAAT: { icon: '🍚', color: '#FFFFFF', shadow: '#cbd5e1', name: 'Steamed Rice', nameBn: 'ভাত' },
  DAAL: { icon: '🥣', color: '#facc15', shadow: '#ca8a04', name: 'Lentil Soup', nameBn: 'ডাল' },
  SHOBJIE: { icon: '🥦', color: '#4ade80', shadow: '#166534', name: 'Vegetable Curry', nameBn: 'সবজি' },
  RUTI: { icon: '🫓', color: '#fed7aa', shadow: '#9a3412', name: 'Flatbread', nameBn: 'রুটি' },
  BIRYANI: { icon: '🍗', color: '#f87171', shadow: '#991b1b', name: 'Kacchi Biryani', nameBn: 'বিরিয়ানি' },
  FISH: { icon: '🐟', color: '#60a5fa', shadow: '#1e40af', name: 'Hilsa Fish', nameBn: 'ইলিশ মাছ' },
  MISHTI: { icon: '🍨', color: '#fbcfe8', shadow: '#9d174d', name: 'Sweet Yogurt', nameBn: 'মিষ্টি দই' },
};

export const FOOD_ITEMS = FOOD_CONFIG;

export const LEVELS: Level[] = [
  { id: 1, moves: 30, target: 800, desc: "Welcome to Dadi's Kitchen! Match 3 foods to start.", recipeName: "Plain Rice & Daal" },
  { id: 2, moves: 25, target: 1500, desc: "The guests are coming! Collect a high score.", recipeName: "Spicy Bhuna Khichuri" },
  { id: 3, moves: 22, target: 3000, desc: "A royal feast requires precision. Make big combos!", recipeName: "Shorshe Ilish" },
  { id: 4, moves: 20, target: 4500, desc: "The kitchen is getting busy! Can you keep up?", recipeName: "Mutton Kacchi" },
  { id: 5, moves: 18, target: 6000, desc: "Grandmaster Chef Level! Only the best can win.", recipeName: "Royal Wedding Feast" }
];

export const CREATOR_INFO = {
  name: "Dadi's Favorite Grandson",
  facebook: "DesiFeastGame"
};
