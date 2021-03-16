import { Request, Response } from "express";
import { client, connection } from "../index";
import { AutomaticRoom } from "../entity/AutomaticRoom";

const express = require("express");
const gameRouter = express.Router();

gameRouter.post("/data", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.json("ur not user");
    return;
  }
  const { gameId } = user;
  if (!gameId) {
    res.json("something wrong");
    return;
  }
  if (await client.get(gameId.toString())) {
    const data = await client.get(gameId.toString());
    res.json(data);
    return;
  } else {
    const room = await connection.manager.findOne(AutomaticRoom, {
      id: Number(gameId),
    });
    if (!room) {
      res.redirect("/");
      return;
    }
    await client.set(gameId.toString(), room.data);
    const data = await client.get(gameId.toString());
    res.json(data);
    return;
  }
});

export default gameRouter;
