import { Request, Response } from "express";
import path from "path";
import { connection } from "../index";
import { Room } from "../entity/Room";
import { GameData } from "../types";

const express = require("express");

const apiRouter = express.Router();

apiRouter.post("/createRoom/:name", async (req: Request, res: Response) => {
  const { name } = req.params; // Room name
  const { user } = req.session; // User
  if (name.length > 10) {
    res.json("room name too long"); // Validate room name, maybe some regex would be great
  } else {
    const room = new Room(); // Creating new room
    room.room_name = decodeURIComponent(name);
    // Later, when game will be working, it should contain all of its data, like players positions etc
    room.data = JSON.stringify([
      {
        name: user?.name,
        uuid: user?.userID,
        state: 0,
      },
    ]);
    // Room config, isnt started so others can join to play
    room.has_started = false;
    room.owner = user!.name;
    room.ownerID = user!.userID; // it is used to validate whether user can change room, kick players etc. its uuid
    const savedData = await connection.manager.save(room);
    user!.inGame = true;
    user!.gameID = savedData.id.toString();
    res.redirect(`/api/room/${savedData.id}`); // Redirects to created room
  }
});

apiRouter.get("/getRoomList", async (_: Request, res: Response) => {
  const roomList = await connection.manager.find(Room); // list of all rooms
  const parsedRoomList = roomList.map((room: Room) => {
    const data: GameData[] = JSON.parse(room.data); // we need to parse data to json in order to iterate over it
    const names = JSON.stringify(
      data.map(
        (item: GameData) => item.name // in Room list we kinda only want participants names
      )
    );
    return {
      id: room.id,
      data: names,
      has_started: room.has_started,
      room_name: room.room_name,
    };
  });
  res.json(parsedRoomList);
});

apiRouter.post("/joinRoom/:roomID", async (req: Request, res: Response) => {
  const { user } = req.session;
  const { roomID } = req.params;
  if (user?.inGame) {
    res.redirect(`/api/room/${user.gameID}`); // If users is already in game redirect him to his game
    return;
  }

  const room = await connection.manager.findOne(Room, {
    id: Number(roomID),
  });

  if (!room) res.json("No room");
  // If room is not found return some error message
  else {
    const roomData = JSON.parse(room.data);
    console.log(roomData);
    console.log(roomData.length);
    if (roomData.length < 4 && user) {
      const obj = {
        name: user.name,
        uuid: user.userID,
        state: 0,
        // Lately, initial positions etc
      };
      user.inGame = true;
      user.gameID = roomID;
      roomData.push(obj);
      room.data = JSON.stringify(roomData);
      res.redirect(`/api/room/${roomID}`); // redirect to room
    } else {
      // room is already full
      res.json("Room is already full, but you can still watch");
    }
    await connection.manager.save(room);
  }
});

apiRouter.post("/leaveRoom", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (user) {
    const currentRoom = await connection.manager.findOne(Room, {
      id: Number(user.gameID),
    });
    if (currentRoom) {
      let { data } = currentRoom;
      let parsedData: GameData[] = JSON.parse(data);
      parsedData = parsedData.filter((el) => el.uuid !== user.userID); // filter to remove user from room data
      currentRoom.data = JSON.stringify(parsedData); // save filtered data
      await connection.manager.save(currentRoom);
    }
  }
  res.redirect("/");
});

apiRouter.get("/room/:roomID", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (user?.inGame && user?.gameID === req.params.roomID) {
    res.sendFile(path.join(__dirname, "../", "public", "lobby.html"));
  } else if (user?.inGame) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "../", "public", "lobby.html"));
  }
});

apiRouter.post("/room/:roomID", async (req: Request, res: Response) => {
  const room = await connection.manager.findOne(Room, {
    id: Number(req.params.roomID),
  });
  if (room) {
    let data = JSON.parse(room.data);
    const { id, has_started, owner, room_name } = room;
    data = JSON.stringify(
      data.map((element: any) => {
        const { name, state } = element;
        return { name, state };
      })
    );
    res.json({ id, data, has_started,  room_name, owner});
  } else {
    res.json("there is no room :CC");
  }
});

apiRouter.post("/room/:roomID/owner", async (req: Request, res: Response) => {
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

export default apiRouter;
