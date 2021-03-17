import { connection } from "./index";
import { AutomaticRoom } from "./entity/AutomaticRoom";

const express = require("express");

const automaticRouter = express.Router();

export const cleanDatabase = async () => {
  const rooms: AutomaticRoom[] = await connection.manager.find(AutomaticRoom);
  for (const room of rooms) {
    const roomInactiveFor = Date.now() - room.updated_at.getTime();
    if (roomInactiveFor > 1000 * 60 * 5 && !room.has_started) {
      await connection.manager.delete(AutomaticRoom, {
        id: room.id,
      });
    }
  }
};

export const clearDatabase = async () => {
  const rooms = await connection.getRepository(AutomaticRoom);
  rooms.clear();
  return;
};

// });

export default automaticRouter;
