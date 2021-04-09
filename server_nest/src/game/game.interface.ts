type Placement = 1 | 2 | 3 | 4;
export interface Finish {
  player: PlayerData | PlayerDataRO;
  placement: Placement;
}
export interface GameData {
  players: PlayerData[] | PlayerDataRO[];
  finished: Finish[];
  currentTurn: Color;
  ended?: boolean;
  turnTime: Date;
  turnStatus: 1 | 2 | null;
  rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
}

export interface PlayerData {
  name: string;
  userId: string;
  color: Color;
  isAFK: boolean;
  positions: number[];
}

export interface PlayerDataRO {
  name: string;
  color: Color;
  positions: number[];
}

export type Color = 'red' | 'blue' | 'green' | 'yellow';

export const colorsValues = {
  red: 0,
  blue: 1,
  green: 2,
  yellow: 3,
};
