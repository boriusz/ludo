import { NextFunction, Request, Response } from "express";
import { connection } from "./index";
import { AutomaticRoom } from "./entity/AutomaticRoom";
import { PLAYER_COLORS } from "./constants";
import { GameData } from "./types";

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

// automaticRouter.get("/joinGame", async (req: Request, res: Response) => {
export const joinGame = async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.redirect("/");
    return;
  }
  // User exists but is not in game

  const roomList: AutomaticRoom[] = await connection.manager.find(
    AutomaticRoom
  );

  for (const room of roomList) {
    const { data } = room;
    const parsedData = JSON.parse(data);
    if (parsedData.length < 4 && !room.has_started) {
      const { data } = room;
      const parsedData = JSON.parse(data);

      const unavailableColors = parsedData.map((player: GameData) => {
        const playerData = Object.values(player)[0];
        return playerData.color;
      });

      let color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
      while (unavailableColors.find((el: string) => el === color)) {
        color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
      }

      parsedData.push({
        [user.userID]: {
          name: user.name,
          state: 0,
          position: "",
          color,
        },
      });
      console.log("user is joining room ", room.id);
      room.data = JSON.stringify(parsedData);
      user.gameId = room.id;
      user.inGame = true;
      await connection.manager.save(room);
      return;
    }
  }

  // There is no room to join so create one
  const room = new AutomaticRoom();
  room.has_started = false;
  const id: string = user!.userID;
  const color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
  room.data = JSON.stringify([
    {
      [id]: {
        name: user.name,
        state: 0,
        position: "",
        color,
      },
    },
  ]);
  room.has_started = false;
  const savedData = await connection.manager.save(room);
  user!.inGame = true;
  user!.gameId = savedData.id;
  console.log("user created room ", savedData.id);
  return;
};
// });

export default automaticRouter;
