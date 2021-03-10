import { Request, Response } from "express";
import { connection } from "../index";
import { AutomaticRoom } from "../entity/AutomaticRoom";
import { PLAYER_COLORS } from "../constants";
import path from "path";
import { GameData } from "../types";

const express = require("express");

const automaticRouter = express.Router();

automaticRouter.get("/joinGame", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.sendFile(path.join(__dirname, "../", "public", "username.html"));
    return;
  }

  const roomList: AutomaticRoom[] = await connection.manager.find(
    AutomaticRoom
  );

  for (const room of roomList) {
    const { data } = room;
    const parsedData = JSON.parse(data);
    if (parsedData.length < 4 && !room.has_started) {
      user.gameID = room.id;
      user.inGame = true;

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
      room.data = JSON.stringify(parsedData);
      await connection.manager.save(room);

      res.redirect("/api/room");
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
  user!.gameID = savedData.id;
  res.redirect("/api/room/");
});

export default automaticRouter;
