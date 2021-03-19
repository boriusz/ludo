import { client } from "./index";
import { GameData, UserGameData } from "./types";

const handleTurn = async (
  user:
    | { name: string; inGame: boolean; userId: string; gameId: number | null }
    | undefined,
  gameData: GameData
): Promise<0 | 1 | 2 | null> => {
  if (user && user.inGame && user.gameId) {
    const player = gameData.players.find(
      (player: UserGameData) => user.userId === Object.values(player)[0].userId
    );
    if (player && Object.keys(player)[0] === gameData.currentTurn) {
      if (!gameData.turnStatus) {
        gameData.turnStatus = 1;
        await client.set(user.gameId.toString(), JSON.stringify(gameData));
      }
      return gameData.turnStatus;
    }
  }
  return 0;
};

export const isPlayersTurn = async (
  user:
    | { name: string; inGame: boolean; userId: string; gameId: number | null }
    | undefined
): Promise<boolean> => {
  if (!user || !user.inGame || !user.gameId) return false;

  const roomData = await client.get(user.gameId.toString());
  if (roomData) {
    const parsedRoomData: GameData = JSON.parse(roomData);
    const player = parsedRoomData.players.find(
      (player: UserGameData) => user.userId === Object.values(player)[0].userId
    );
    return !!(player && Object.keys(player)[0] === parsedRoomData.currentTurn);
  }
  return false;
};

export default handleTurn;
