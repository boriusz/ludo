export interface RoomInterface {
  id: number;
  data: string;
  has_started: boolean;
  room_name: string;
  owner: string;
}
export interface GameData {
  name: string;
  uuid: string;
  state: number;
}
