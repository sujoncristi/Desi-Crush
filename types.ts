
export type FoodType = 'BHAAT' | 'DAAL' | 'SHOBJIE' | 'RUTI' | 'BIRYANI' | 'FISH' | 'MISHTI';

export enum SpecialEffect {
  NONE = 'NONE',
  STRIPED_H = 'STRIPED_H',
  STRIPED_V = 'STRIPED_V',
  WRAPPED = 'WRAPPED',
  COLOR_BOMB = 'COLOR_BOMB'
}

export type BoosterType = 'HAMMER' | 'SHUFFLE' | 'BOMB' | 'ROW_CLEAR';

export interface TileData {
  id: string;
  type: FoodType;
  special: SpecialEffect;
}

export interface Level {
  id: number;
  moves: number;
  target: number;
  desc: string;
  descBn?: string;
  recipeName: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  language: 'EN' | 'BN';
}

export interface GameState {
  currentLevel: number;
  score: number;
  movesLeft: number;
  board: (TileData | null)[][];
  isAnimating: boolean;
  unlockedLevels: number;
  collected: Record<string, number>;
  boosters: Record<BoosterType, number>;
  activeBooster: BoosterType | null;
  streak: number;
  lastClaimDate: string | null;
  showTutorial: boolean;
  settings: GameSettings;
}
