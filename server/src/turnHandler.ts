import { client } from "./index";
import { ColorType, GameData, UserGameData } from "./types";
import cacheRoomData from "./cacheRoomData";
import { colorsValues } from "./constants";

const handleTurn = async (
  user:
    | { name: string; inGame: boolean; userId: string; gameId: number | null }
    | undefined,
  gameData: GameData
): Promise<1 | 2 | null> => {
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
  return null;
};

export const passTurnToNextPlayer = async (gameId: number): Promise<void> => {
  let roomData = await client.get(gameId.toString());
  if (!roomData) {
    await cacheRoomData(gameId);
    roomData = await client.get(gameId.toString());
  }
  if (roomData) {
    const parsedRoomData = JSON.parse(roomData);
    const currentTurn: ColorType = parsedRoomData.currentTurn;
    const colorsInGame: ColorType[] = parsedRoomData.players
      .map((player: UserGameData) => Object.keys(player)[0] as ColorType)
      .sort((a: ColorType, b: ColorType) => colorsValues[b] - colorsValues[a]);
    const currentTurnIdex = colorsInGame.findIndex(
      (item: ColorType) => item === currentTurn
    );
    if (currentTurnIdex === colorsInGame.length - 1)
      parsedRoomData.currentTurn = colorsInGame[0];
    else parsedRoomData.currentTurn = colorsInGame[currentTurnIdex + 1];
    await client.set(gameId.toString(), JSON.stringify(parsedRoomData));
  }
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
