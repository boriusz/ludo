import { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const express = require("express");
const appRouter = express.Router();

appRouter.get("/", (req: Request, res: Response) => {
  if (!req.session?.user?.name) {
    res.sendFile(path.join(__dirname, "../", "public", "username.html")); // Unknown user -> redirect to register
  } else {
    if (req.session.user!.inGame) {
      res.redirect(`/api/room/${req.session.user!.gameID}`); // User is already in game -> redirect to game
    } else {
      res.sendFile(path.join(__dirname, "../", "public", "homepage.html")); // Redirect to room list
    }
  }
});

appRouter.post("/setUsername", (req: Request, res: Response) => {
  const { username } = req.body;
  if (username.length > 10) {
    res.json("too long name"); // Validate username length
  } else {
    req.session.user = {
      name: encodeURIComponent(username), // Encode username, decode only to display it
      inGame: false,
      userID: uuidv4(), // Unique id
    };
    res.redirect("/");
  }
});

export default appRouter;
