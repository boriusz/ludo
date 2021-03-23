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
        parsedRoomData.hasChanged = false;
        await client.set(gameId.toString(), JSON.stringify(parsedRoomData));
        const { rolledNumber, players, currentTurn } = parsedRoomData;
        res.json({ rolledNumber, players, currentTurn });
        return;
      }
      res.json(parsedRoomData.rolledNumber);
      return;
    }
  }
  res.json("not your turn");
});

gameRouter.post("/movePawn", async (req: Request, res: Response) => {
  const { user } = req.session;
  const { pawnId } = req.body;
  if (!user) return;
  const { gameId, inGame } = user;
  if (gameId && inGame) {
    if (await isPlayersTurn(user)) {
      let room = await client.get(gameId.toString());
      if (!room) {
        await cacheRoomData(gameId);
        room = await client.get(gameId.toString());
      }
      if (room) {
        const parsedRoomData: GameData = JSON.parse(room);
        const { currentTurn, rolledNumber } = parsedRoomData;
        const { players } = parsedRoomData;
        const player: UserGameData | undefined = players.find(
          (player: UserGameData) => Object.keys(player)[0] === currentTurn
        );
        if (player && rolledNumber) {
          const playerData = Object.values(player)[0];
          const movedPawn: number = playerData.position[pawnId];
          if (rolledNumber !== 6 && rolledNumber !== 1 && movedPawn === 0) {
            res.json("cant move this one");
            return;
          }
          if (movedPawn === 0) playerData.position[pawnId] = 1;
          else playerData.position[pawnId] += rolledNumber;

          Object.values(player)[0] = playerData;
          parsedRoomData.turnStatus = null;
          parsedRoomData.rolledNumber = null;
          parsedRoomData.hasChanged = true;
          await client.set(gameId.toString(), JSON.stringify(parsedRoomData));
          await passTurnToNextPlayer(gameId);
          res.json("ok");
          return;
        }
      }
    }
  }
  res.json("not your turn");
  return;
});

export default gameRouter;
