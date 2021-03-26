export interface RoomPlayersData {
  name: string;
  userId: string;
  isReady: boolean;
  color: Color;
}

export type Color = 'red' | 'blue' | 'green' | 'yellow';

export const colorsValues = {
  red: 4,
  blue: 3,
  green: 2,
  yellow: 1,
};

export const PLAYER_COLORS = ['red', 'blue', 'green', 'yellow'];

export interface RoomRO {
  players: {
    name: string;
    isReady: boolean;
    color: Color;
  }[];
  hasStarted: boolean;
}
