import { connection } from "./index";
import { AutomaticRoom } from "./entity/AutomaticRoom";

export const cleanDatabase = async (): Promise<void> => {
  const rooms: AutomaticRoom[] = await connection.manager.find(AutomaticRoom);
  for (const room of rooms) {
    const roomInactiveFor = Date.now() - room.updatedAt.getTime();
    if (roomInactiveFor > 1000 * 60 * 5 && !room.hasStarted) {
      await connection.manager.delete(AutomaticRoom, {
        id: room.id,
      });
    }
  }
};

export const clearDatabase = async (): Promise<void> => {
  const rooms = await connection.getRepository(AutomaticRoom);
  rooms.clear();
};
