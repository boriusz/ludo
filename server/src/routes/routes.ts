import express, { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import { joinGame } from "../joinGame";

const appRouter = express.Router();

appRouter.get("/", (req: Request, res: Response) => {
  if (!req.session?.user) {
    res.sendFile(path.join(__dirname, "../", "public", "username.html"));
    return;
  }
  res.sendFile(path.join(__dirname, "../", "public", "lobby.html"));
});

appRouter.post("/setUsername", async (req: Request, res: Response) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  const { username } = req.body;
  if (username.length > 10) {
    res.json("too long name");
    return;
  }
  req.session.user = {
    name: encodeURIComponent(username),
    inGame: false,
    userId: uuidv4(),
    gameId: null,
  };
  await joinGame(req, res);
  const file = await fs.readFile(
    path.join(__dirname, "../", "public", "lobby.html")
  );
  res.send(JSON.stringify(file.toString()));
});

export default appRouter;
