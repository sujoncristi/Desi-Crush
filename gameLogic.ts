
import { FoodType, TileData, SpecialEffect } from './types.ts';
import { FOOD_CONFIG, GRID_SIZE } from './constants.tsx';

const FOOD_TYPES = Object.keys(FOOD_CONFIG) as FoodType[];

export const createTile = (type: FoodType, special = SpecialEffect.NONE): TileData => ({
  id: Math.random().toString(36).substring(2, 9),
  type,
  special
});

export const initBoard = (): (TileData | null)[][] => {
  const board: (TileData | null)[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let type: FoodType;
      do {
        type = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
      } while (
        (c >= 2 && board[r][c-1]?.type === type && board[r][c-2]?.type === type) ||
        (r >= 2 && board[r-1] && board[r-1][c]?.type === type && board[r-2][c]?.type === type)
      );
      board[r][c] = createTile(type);
    }
  }
  return board;
};

export const shuffleBoard = (board: (TileData | null)[][]): (TileData | null)[][] => {
  const flat = board.flat().filter(t => t !== null) as TileData[];
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  
  const newBoard: (TileData | null)[][] = [];
  let index = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    newBoard[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      newBoard[r][c] = flat[index++] || createTile(FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)]);
    }
  }
  return newBoard;
};

export const findMatches = (board: (TileData | null)[][]) => {
  const matches = new Set<string>();
  const specials: { r: number, c: number, effect: SpecialEffect, type: FoodType }[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 2; c++) {
      const t = board[r][c];
      if (!t) continue;
      let count = 1;
      while (c + count < GRID_SIZE && board[r][c + count]?.type === t.type) count++;
      if (count >= 3) {
        for (let i = 0; i < count; i++) matches.add(`${r},${c + i}`);
        if (count === 4) specials.push({ r, c: c + 1, effect: SpecialEffect.STRIPED_H, type: t.type });
        if (count >= 5) specials.push({ r, c: c + 2, effect: SpecialEffect.COLOR_BOMB, type: t.type });
        c += count - 1;
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r < GRID_SIZE - 2; r++) {
      const t = board[r][c];
      if (!t) continue;
      let count = 1;
      while (r + count < GRID_SIZE && board[r + count][c]?.type === t.type) count++;
      if (count >= 3) {
        for (let i = 0; i < count; i++) matches.add(`${r + i},${c}`);
        if (count === 4) specials.push({ r: r + 1, c, effect: SpecialEffect.STRIPED_V, type: t.type });
        if (count >= 5) specials.push({ r: r + 2, c, effect: SpecialEffect.COLOR_BOMB, type: t.type });
        r += count - 1;
      }
    }
  }

  return {
    indices: Array.from(matches).map(s => {
      const [r, c] = s.split(',').map(Number);
      return { r, c };
    }),
    specials
  };
};

export const applyGravity = (board: (TileData | null)[][]) => {
  const newBoard = board.map(row => [...row]);
  for (let c = 0; c < GRID_SIZE; c++) {
    let empty = 0;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (!newBoard[r][c]) empty++;
      else if (empty > 0) {
        newBoard[r + empty][c] = newBoard[r][c];
        newBoard[r][c] = null;
      }
    }
    for (let r = 0; r < empty; r++) {
      newBoard[r][c] = createTile(FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)]);
    }
  }
  return newBoard;
};
