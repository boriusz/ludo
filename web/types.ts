export interface UserGameData {
  name: string;
  color: Color;
  positions: number[];
}
export interface GameData {
  players: UserGameData[];
  currentTurn: Color;
  turnStatus: number;
  rolledNumber: number;
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
