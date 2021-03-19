import express, { Request, Response } from "express";
import { client } from "../index";
import waitForGameDataChange from "../waitForGameDataChange";
import cacheRoomData from "../cacheRoomData";
import handleTurn, { isPlayersTurn } from "../turnHandler";

const gameRouter = express.Router();

gameRouter.get("/data", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user || !user.gameId) {
    res.redirect("/");
    return;
  }
  const { gameId } = user;
  let gameData = await client.get(gameId.toString());
  if (!gameData) {
    await cacheRoomData(gameId);
    gameData = await client.get(gameId.toString());
  }
  if (gameData) {
    const parsedGameData = JSON.parse(gameData);
    if (await isPlayersTurn(user)) {
      const moveType = await handleTurn(user, parsedGameData);
      await waitForGameDataChange(gameId);
      res.json({ parsedGameData, moveType });
      return;
    }
    await waitForGameDataChange(gameId);
    res.json(parsedGameData);
    return;
  }
});

gameRouter.get("/roll", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user || !user.inGame || !user.gameId) {
    res.redirect("/");
    return;
  }

  if (await isPlayersTurn(user)) {
    const { gameId } = user;
    let room = await client.get(gameId.toString());
    if (!room) {
      await cacheRoomData(gameId);
      room = await client.get(gameId.toString());
    }
    if (room) {
      const parsedRoomData = JSON.parse(room);
      if (parsedRoomData.turnStatus === 1 && !parsedRoomData.rolledNumber) {
        parsedRoomData.rolledNumber = Math.floor(Math.random() * 7);
        await client.set(gameId.toString(), JSON.stringify(parsedRoomData));
        res.json(parsedRoomData.rolledNumber);
        return;
      }
      res.json("forbidden action");
      return;
    }
  }
  res.json("not your turn");
});

export default gameRouter;
