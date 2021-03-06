export interface GameData {
  [id: string]: {
    name: string;
    isOwner: boolean;
    state: number;
    position: string;
  };
}
