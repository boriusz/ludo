export interface GameData {
  players: PlayerData[];
  currentTurn: Color;
  turnStatus: 1 | 2 | null;
  rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
}

export interface PlayerData {
  name: string;
  userId: string;
  color: Color;
  positions: number[];
}

export interface PlayerDataRO {
  name: string;
  color: Color;
  positions: number[];
}

export interface GameDataRO {
  players: PlayerDataRO[];
  currentTurn: Color;
  turnStatus: 1 | 2 | null;
  rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
}

export type Color = 'red' | 'blue' | 'green' | 'yellow';

export const colorsValues = {
  red: 4,
  blue: 3,
  green: 2,
  yellow: 1,
};
