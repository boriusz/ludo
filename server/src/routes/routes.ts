import { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const express = require("express");
const appRouter = express.Router();

appRouter.get("/", (req: Request, res: Response) => {
  if (!req.session?.user?.name) {
    res.sendFile(path.join(__dirname, "../", "public", "username.html"));
    return;
  }
  if (req.session.user!.inGame) {
    res.redirect("/api/room");
    return;
  }
  res.redirect("/automatic/joinGame");
});

appRouter.post("/setUsername", (req: Request, res: Response) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  const { username } = req.body;
  if (username.length > 10) {
    res.json("too long name");
  } else {
    req.session.user = {
      name: encodeURIComponent(username),
      inGame: false,
      userID: uuidv4(),
    };
    res.redirect("/");
  }
});

export default appRouter;
