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
  console.log(user);
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
  if (room.has_started) {
    res.redirect("/game/");
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

// apiRouter.post("/room/:roomID/start", async (req: Request, res: Response) => {
//   const { user } = req.session;
//   const { roomID } = req.params;
//   const room = await connection.manager.findOne(Room, {
//     id: Number(roomID),
//   });
//   if (room && room.ownerID === user?.userID) {
//     const parsedRoomData: GameData[] = JSON.parse(room.data);
//     const readyArray = parsedRoomData.map((user: GameData) => {
//       return Object.values(user)[0].state === 1;
//     });
//     if (!readyArray.every((item: boolean) => item)) {
//       res.json("cant start yet");
//       return;
//     } else if (parsedRoomData.length < 2) {
//       res.json("Need atleast 2 users");
//       return;
//     } else {
//       // Start game here
//       room.time_to_begin = new Date(Date.now() + TIME_BEFORE_START);
//       await connection.manager.save(room);
//       res.json("starting");
//     }
//   } else {
//     res.json("you are not an owner/");
//   }
// });

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
  const parsedData = JSON.parse(data);
  const id: string = user.userID;
  const userInDb = parsedData.find((el: string) => Object.keys(el)[0] === id);
  if (userInDb[id]) {
    if (isReady === "true") {
      userInDb[id].state = 1;
    } else {
      userInDb[id].state = 0;
    }
  }
  room.data = JSON.stringify(parsedData);
  await connection.manager.save(room);
  res.json("ok");
});

export default apiRouter;
