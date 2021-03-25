export interface RoomPlayersData {
  name: string;
  userId: string;
  isReady: boolean;
  color: Color;
}

type Color = 'red' | 'blue' | 'green' | 'yellow';

export interface RoomRO {
  players: {
    name: string;
    isReady: boolean;
    color: Color;
  }[];
  hasStarted: boolean;
}
