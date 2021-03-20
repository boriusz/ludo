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
  currentTurn: ColorType;
  turnStatus: number;
  rolledNumber: number;
  hasChanged?: boolean | null;
}

export type ColorType = "red" | "blue" | "green" | "yellow";
