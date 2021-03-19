import { client, connection } from "./index";
import { AutomaticRoom } from "./entity/AutomaticRoom";
import { GameData } from "./types";

const cacheRoomData = async (gameId: number): Promise<void> => {
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: gameId,
  });
  if (room) {
    const parsedData: GameData = JSON.parse(room.data);
    parsedData.hasChanged = true;
    parsedData.currentTurn = "red";
    room.data = JSON.stringify(parsedData);
    await client.set(gameId.toString(), room.data);
    return;
  }
};
export default cacheRoomData;
