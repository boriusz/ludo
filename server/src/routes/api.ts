import { NextFunction, Request, Response } from "express";
import { connection } from "../index";
import { GameData } from "../types";
import { AutomaticRoom } from "../entity/AutomaticRoom";
import { joinGame } from "./automatic";

const express = require("express");

const apiRouter = express.Router();

apiRouter.post(
  "/room",
  joinGame,
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.session;

    const roomID = user!.gameID!;
    const room = await connection.manager.findOne(AutomaticRoom, {
      id: roomID,
    });
    if (!room) {
      user!.inGame = false;
      user!.gameID = null;
      res.redirect("/");
      return;
    }
    let parsedData: GameData[] = JSON.parse(room.data);
    if (parsedData.length === 4) {
      room.has_started = true;
      await connection.manager.save(room);
    }
    let data: any;
    const items = parsedData.map((data1: GameData) => {
      return Object.values(data1)[0];
    });
    const { id, has_started } = room;
    data = JSON.stringify(
      items.map((element) => {
        const { name, state, color } = element;
        return { name, state, color };
      })
    );
    res.json({ id, data, has_started });
  }
);

apiRouter.post("/leaveRoom", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.json("htf did u leave");
    return;
  }

  const roomID = user.gameID!;
  user!.inGame = false;
  user!.gameID = null;

  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });

  if (!room) {
    res.json("there is no room to leave :C");
    return;
  }

  let { data } = room;
  let parsedData: GameData[] = JSON.parse(data);
  parsedData = parsedData.filter((element: GameData) => {
    if (Object.keys(element)[0] !== user.userID) {
      return element;
    }
    return;
  });

  if (parsedData.length === 0) {
    await connection.manager.delete(AutomaticRoom, {
      id: room.id,
    });
    res.json("room went dark");
  } else {
    room.data = JSON.stringify(parsedData);
    await connection.manager.save(room);
    res.json("ok");
  }
});

apiRouter.post("/room/ready/:isReady", async (req: Request, res: Response) => {
  const { isReady } = req.params;
  const { user } = req.session;
  if (!user) {
    res.json("no user to be ready");
    return;
  }
  if (!user?.inGame) {
    res.json("user is not in game");
    return;
  }
  const roomID = user.gameID!;
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });
  if (!room) {
    res.json("room does not exist");
    return;
  }
  const { data } = room;
  const parsedData: GameData[] = JSON.parse(data);
  const id: string = user.userID;
  const userInDb = parsedData.find((el: GameData) => Object.keys(el)[0] === id);
  if (!userInDb) {
    res.json("no user");
    return;
  }
  if (userInDb[id]) {
    if (isReady === "true") {
      userInDb[id].state = 1;
    } else {
      userInDb[id].state = 0;
    }
  }
  const usersStates = parsedData.map((item: GameData) => {
    return Object.values(item)[0].state === 1;
  });
  if (parsedData.length > 1 && usersStates.every((item: boolean) => item)) {
    room.has_started = true;
  }
  room.data = JSON.stringify(parsedData);
  await connection.manager.save(room);
  res.json("ok");
  return;
});

export default apiRouter;
