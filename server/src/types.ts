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
  currentTurn?: "red" | "blue" | "green" | "yellow";
}
