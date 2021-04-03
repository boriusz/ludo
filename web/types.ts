type Placement = 1 | 2 | 3 | 4;

export interface Finish {
  player: PlayerData;
  placement: Placement;
}

export interface GameData {
  players: PlayerData[];
  finished: Finish[];
  currentTurn: Color;
  ended?: boolean;
  turnTime: number;
  turnStatus: 1 | 2 | null;
  rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
}

export interface PlayerData {
  name: string;
  color: Color;
  positions: number[];
}

export interface RoomRO {
  players: {
    name: string;
    isReady: boolean;
    color: Color;
  }[];
  hasStarted: boolean;
}

export type Color = "red" | "blue" | "green" | "yellow";
