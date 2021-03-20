import express, { Request, Response } from "express";
import { client } from "../index";
import waitForGameDataChange from "../waitForGameDataChange";
import cacheRoomData from "../cacheRoomData";
import handleTurn, {
  isPlayersTurn,
  passTurnToNextPlayer,
} from "../turnHandler";
import { GameData, UserGameData } from "../types";

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
    const parsedGameData: GameData = JSON.parse(gameData);
    if (await isPlayersTurn(user)) {
      await handleTurn(user, parsedGameData);
      await waitForGameDataChange(gameId);
      res.json(parsedGameData);
      return;
    }
    await waitForGameDataChange(gameId);
    const { players, currentTurn } = parsedGameData;
    res.json({ players, currentTurn });
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
        parsedRoomData.rolledNumber = Math.floor(Math.random() * 6) + 1;
        const currentPlayer: UserGameData = parsedRoomData.players.find(
          (player: UserGameData) =>
            Object.values(player)[0].userId === user.userId
        );
        const currentPlayerPositions = Object.values(currentPlayer)[0].position;
        if (
          currentPlayerPositions.every((item: number) => item === 0) &&
          parsedRoomData.rolledNumber !== 1 &&
          parsedRoomData.rolledNumber !== 6
        ) {
          await passTurnToNextPlayer(gameId);
          res.json(parsedRoomData.rolledNumber);
          return;
        }
        parsedRoomData.turnStatus = 2;
        await client.set(gameId.toString(), JSON.stringify(parsedRoomData));
        res.json(parsedRoomData.rolledNumber);
        return;
      }
      res.json(parsedRoomData.rolledNumber);
      return;
    }
  }
  res.json("not your turn");
});

export default gameRouter;
