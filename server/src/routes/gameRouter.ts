import { Request, Response } from "express";
import path from "path";
import { connection } from "../index";
import { Room } from "../entity/Room";

const express = require("express");
const gameRouter = express.Router();

gameRouter.get("/:roomID", async (req: Request, res: Response) => {
  const room = await connection.manager.findOne(Room, {
    id: Number(req.params.roomID),
  });
  if (!room) {
    res.redirect("/");
    return;
  }
  res.sendFile(path.join(__dirname, "../", "public", "game.html"));
});

export default gameRouter;
