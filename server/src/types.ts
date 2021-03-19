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
  turnStatus?: 1 | 2 | null; // 1- waiting for diceroll/ 2- waiting for pionek choose
  rolledNumber?: 1 | 2 | 3 | 4 | 5 | 6 | null;
}
