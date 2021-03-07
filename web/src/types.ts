export interface RoomInterface {
  id: number;
  data: string;
  has_started: boolean;
  room_name: string;
  owner: string;
  time_to_begin: Date | null;
}
export interface GameData {
  name: string;
  uuid: string;
  state: number;
}
