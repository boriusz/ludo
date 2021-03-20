import { client, connection } from "./index";
import { AutomaticRoom } from "./entity/AutomaticRoom";
import { ColorType, GameData, UserGameData } from "./types";
import { colorsValues } from "./constants";

const cacheRoomData = async (gameId: number): Promise<void> => {
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: gameId,
  });
  if (room) {
    const parsedRoomData: GameData = JSON.parse(room.data);
    parsedRoomData.hasChanged = true;
    const colorsInGame: ColorType[] = parsedRoomData.players.map(
      (player: UserGameData) => Object.keys(player)[0] as ColorType
    );
    const sortedColorsInGame: ColorType[] = colorsInGame.sort(
      (a: ColorType, b: ColorType) => colorsValues[b] - colorsValues[a]
    );
    parsedRoomData.currentTurn = sortedColorsInGame[0];
    room.data = JSON.stringify(parsedRoomData);
    await client.set(gameId.toString(), room.data);
    return;
  }
};
export default cacheRoomData;
