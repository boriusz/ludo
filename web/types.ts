export interface UserGameData {
  [color: string]: {
    name: string;
    userId: string;
    state: number;
    position: string;
  };
}
export interface GameData {
  players: UserGameData[];
  hasChanged?: boolean | null;
}

export type ColorType = "red" | "blue" | "green" | "yellow";
