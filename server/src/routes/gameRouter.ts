import { Request, Response } from "express";
import { client, connection } from "../index";
import { AutomaticRoom } from "../entity/AutomaticRoom";
import waitForGameDataChange from "../waitForGameDataChange";
import { GameData, UserGameData } from "../types";

const express = require("express");
const gameRouter = express.Router();

gameRouter.get("/data", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.redirect("/");
    return;
  }
  const { gameId } = user;
  if (!gameId) {
    res.redirect("/");
    return;
  }
  let gameData = await client.get(gameId.toString());

  if (gameData) {
    // data already chached
    await waitForGameDataChange(gameId);
    gameData = await client.get(gameId.toString());
    res.json(JSON.parse(gameData!));
    return;
  }
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: Number(gameId),
  });
  if (!room) {
    res.redirect("/");
    return;
  }
  const parsedData: GameData = JSON.parse(room.data);
  parsedData.hasChanged = true;
  parsedData.currentTurn = "red";
  room.data = JSON.stringify(parsedData);
  await connection.manager.save(room);
  await client.set(gameId.toString(), room.data);
  res.json(parsedData);
  return;
});

gameRouter.post("/rollDice", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user || !user.inGame || !user.gameId) {
    return;
  }
  let roomData = await client.get(user.gameId.toString());
  if (!roomData) {
    console.log("dymy takie że chuj że tego pokoju w redisie nie ma");
    return;
  }
  const parsedRoomData: GameData = JSON.parse(roomData);
  const player = parsedRoomData.players.find((player: UserGameData) => {
    const userId = Object.values(player)[0].userId;
    return user.userId === userId;
  });
  console.log(player);
  console.log(parsedRoomData);
  if (Object.keys(player!)[0] === parsedRoomData.currentTurn) {
    res.json("its your turn");
    return;
  }
  res.json("its not your turn");
  return;
});

export default gameRouter;
