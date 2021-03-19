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
  hasChanged?: boolean | null;
}

export interface GameDataWithMove {
  parsedGameData: GameData;
  moveType: number;
}

export type ColorType = "red" | "blue" | "green" | "yellow";
