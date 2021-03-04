export interface RoomInterface {
  id: number;
  participants: string;
  has_started: boolean;
  room_name: string;
  owner: string;
  created_at: Date;
  updated_at: Date;
}
