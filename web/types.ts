export interface UserGameData {
  [color: string]: {
    name: string;
    userId: string;
    state: number;
    position: number[];
  };
}
export interface GameData {
  players: UserGameData[];
  currentTurn: Color;
  turnStatus: number;
  rolledNumber: number;
  hasChanged?: boolean | null;
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
