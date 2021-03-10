import { Request, Response } from "express";
import path from "path";
import { connection } from "../index";
import { GameData } from "../types";
import { AutomaticRoom } from "../entity/AutomaticRoom";

const express = require("express");

const apiRouter = express.Router();

// apiRouter.get("/joinRoom/:roomID", async (req: Request, res: Response) => {
//   const { user } = req.session;
//   const { roomID } = req.params;
//
//   if (user?.inGame) {
//     res.redirect(`/api/room`); // If users is already in game redirect him to his game
//     return;
//   }
//   const room = await connection.manager.findOne(AutomaticRoom, {
//     id: Number(roomID),
//   });
//
//   if (!room) {
//     res.json("No room");
//     return;
//   }
//   const roomData: GameData[] = JSON.parse(room.data);
//
//   const unavailableColors = roomData.map((player: GameData) => {
//     const playerData = Object.values(player)[0];
//     return playerData.color;
//   });
//
//   let color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
//   while (unavailableColors.find((el: string) => el === color)) {
//     color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
//   }
//
//   const obj = {
//     [user!.userID]: {
//       name: user!.name,
//       color,
//       state: 0,
//       position: "",
//     },
//   };
//
//   user!.inGame = true;
//   user!.gameID = roomID;
//   roomData.push(obj);
//   room.data = JSON.stringify(roomData);
//   res.redirect(`/api/room`);
//
//   await connection.manager.save(room);
// });

apiRouter.get("/room", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) return;
  if (!user.inGame) {
    res.redirect("/automatic/joinGame");
    return;
  }
  const roomID = user.gameID!;
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });
  if (!room) {
    if (user) {
      user.inGame = false;
      user.gameID = null;
    }
    res.redirect("/automatic/joinGame");
    return;
  }
  res.sendFile(path.join(__dirname, "../", "public", "lobby.html"));
});

apiRouter.post("/room", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.redirect("/");
    return;
  }
  if (!user.gameID) {
    res.redirect("/automatic/joinGame");
    return;
  }

  const roomID = user.gameID;
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: roomID,
  });
  if (!room) {
    user.inGame = false;
    user.gameID = null;
    res.redirect("/automatic/joinGame");
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
});

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
});

export default apiRouter;
