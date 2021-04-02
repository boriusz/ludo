type Placement = 1 | 2 | 3 | 4;
interface Finish {
  player: PlayerData;
  placement: Placement;
}
type FinishRO = PlayerDataRO[] & Placement;
export interface GameData {
  players: PlayerData[];
  finished: Finish[];
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
  finished: FinishRO[];
  currentTurn: Color;
  turnStatus: 1 | 2 | null;
  rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
}

export type Color = 'red' | 'blue' | 'green' | 'yellow';

export const colorsValues = {
  red: 0,
  blue: 1,
  green: 2,
  yellow: 3,
};
