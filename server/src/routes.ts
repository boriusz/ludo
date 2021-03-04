import { NextFunction, Request, Response } from "express";
import path from "path";
import { Room } from "./entity/Room";
const express = require("express");
const router = express.Router();
import { connection } from "./index";
import { v4 as uuidv4 } from "uuid";

router.get("/", (req: Request, res: Response) => {
  if (!req.session?.user?.name) {
    res.sendFile(path.join(__dirname, "public", "username.html"));
  } else {
    if (req.session.user!.inGame) {
      res.redirect(`/api/room/${req.session.user!.gameID}`);
    } else {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    }
  }
});

router.post(
  "/setUsername",
  (req: Request, res: Response, next: NextFunction) => {
    req.session.user = {
      name: encodeURIComponent(req.body.username),
      inGame: false,
      userID: uuidv4(),
    };
    next(res.redirect("/"));
  }
);

router.post("/api/createRoom/:name", async (req: Request, res: Response) => {
  const { user } = req.session;
  const room = new Room();
  room.room_name = decodeURIComponent(req.params.name);
  room.participants = user!.name;
  room.has_started = false;
  room.owner = user!.userID;
  const savedData = await connection.manager.save(room);
  user!.inGame = true;
  user!.gameID = savedData.id.toString();
  res.redirect(`/api/room/${savedData.id}`);
});

// TODO: Tutaj normalnie sobie lece i sprawdzam z sesji jak się użytkownik nazywa i auto go dołączam

router.get("/api/getRoomList", async (_: Request, res: Response) => {
  const roomList = await connection.manager.find(Room);
  res.json(roomList);
});

router.post("/api/joinRoom/:roomID", async (req: Request, res: Response) => {
  const { user } = req.session;
  const { roomID } = req.params;
  if (user?.inGame) {
    res.redirect(`/api/room/${user.gameID}`);
  } else {
    const room = await connection.manager.findOne(Room, {
      id: Number(roomID),
    });
    if (room && room.participants.split(" ").length < 4 && user) {
      user.inGame = true;
      user.gameID = roomID;
      room.participants += ` ${user.name}`;
      res.redirect(`/api/room/${roomID}`);
    } else {
      res.json("Room is already full, but you can still watch");
    }
    await connection.manager.save(room);
  }
});

router.get("/api/room/:roomID", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (user?.inGame && user?.gameID === req.params.roomID) {
    // const room = await connection.manager.findOne(Room, {
    //   id: Number(req.params.roomID),
    // });
    // res.send(
    //   `joined room ${req.params.roomID}, current users here: ${room?.participants}`
    // );
    res.sendFile(path.join(__dirname, "public", "lobby.html"));
  } else if (user?.inGame) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "public", "lobby.html"));
  }
});

router.post("/api/room/:roomID", async (req: Request, res: Response) => {
  const room = await connection.manager.findOne(Room, {
    id: Number(req.params.roomID),
  });
  res.json(room);
  // TODO: W pewnym momencie, jak gra ruszy to stąd zamiast json poleci redirect do gry albo coś w tym stylu nw jeszcze
});
router.use(express.static(path.join(__dirname, "public")));

router.post("/api/room/:roomID/owner", async (req: Request, res: Response) => {
  const { roomID } = req.params;
  const { user } = req.session;
  if (user?.inGame && user?.gameID === roomID) {
    const room = await connection.manager.findOne(Room, {
      id: Number(roomID),
    });
    const roomOwner = room?.owner;
    res.json(roomOwner === user!.userID);
  } else {
    res.json("You are only watching m8");
  }
});

export default router;
