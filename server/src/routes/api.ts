import express, { Request, Response } from "express";
import { connection } from "../index";
import { GameData, UserGameData } from "../types";
import { AutomaticRoom } from "../entity/AutomaticRoom";

const apiRouter = express.Router();

apiRouter.get("/room", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user || !user.gameId || !user.inGame) return;

  const roomID = user.gameId;
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });
  if (!room) return;

  const playersData: UserGameData[] = JSON.parse(room.data).players;
  if (playersData.length === 4) {
    room.hasStarted = true;
    await connection.manager.save(room);
  }
  const items = playersData.map((data1: UserGameData) => ({
    key: Object.keys(data1)[0],
    values: Object.values(data1)[0],
  }));
  const { id, hasStarted } = room;
  const data = JSON.stringify(
    items.map(
      (element: { key: string; values: { name: string; state: number } }) => {
        const color = element.key;
        const { name, state } = element.values;
        return { name, state, color };
      }
    )
  );
  res.json({ id, data, hasStarted });
});

apiRouter.post("/leaveRoom", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user || !user.inGame || !user.gameId) {
    res.json("htf did u leave");
    return;
  }
  const roomID = user.gameId;
  user.inGame = false;
  user.gameId = null;

  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });

  if (!room) {
    res.json("there is no room to leave :C");
    return;
  }

  const { data } = room;
  let parsedData: GameData[] = JSON.parse(data);
  parsedData = parsedData.filter((element: GameData) => {
    if (Object.keys(element)[0] !== user.userId) return element;
    return false;
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
  if (!user || !user.inGame || !user.gameId) {
    res.json("no user to be ready");
    return;
  }
  const roomID = user.gameId;
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });
  if (!room) {
    res.json("room does not exist");
    return;
  }
  const { data } = room;
  const playersData: UserGameData[] = JSON.parse(data).players;
  const id: string = user.userId;
  const userInDb = playersData.find(
    (el: UserGameData) => Object.values(el)[0].userId === id
  );
  if (!userInDb) {
    res.json("no user");
    return;
  }
  if (isReady === "true") Object.values(userInDb)[0].state = 1;
  else Object.values(userInDb)[0].state = 0;

  const usersStates = playersData.map(
    (item: UserGameData) => Object.values(item)[0].state === 1
  );
  if (playersData.length > 1 && usersStates.every((item: boolean) => item))
    room.hasStarted = true;

  const parsedData: GameData = JSON.parse(data);
  parsedData.players = playersData;
  room.data = JSON.stringify(parsedData);
  await connection.manager.save(room);
  res.json("ok");
  return;
});

export default apiRouter;
