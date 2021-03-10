export interface RoomInterface {
  id: number;
  data: string;
  secured: boolean;
  has_started: boolean;
  room_name: string;
  owner: string;
  time_to_begin: Date | null;
}
export interface GameData {
  name: string;
  color: string;
  state: number;
}
