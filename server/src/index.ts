import "reflect-metadata";
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { Room } from "./entity/Room";
import * as path from "path";
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const PORT = process.env.PORT || 4000;
const app = express();

declare module "express-session" {
  export interface SessionData {
    user: { name: string; inGame: boolean };
  }
}

app.use(bodyParser({ extended: true }));

app.use(
  session({
    secret: "somebigbrainsecretkeythatnoonewillguess",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 godzina
  })
);

const main = async () => {
  const connection = await createConnection();

  app.get("/", (req: Request, res: Response) => {
    if (!req.session?.user?.name) {
      res.sendFile(path.join(__dirname, "public", "username.html"));
    } else {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    }
  });

  app.post("/setUsername", (req: Request, res: Response) => {
    req.session.user = { name: req.body.username, inGame: false };
    res.redirect("/");
  });

  // TODO: Tutaj normalnie sobie lece i sprawdzam z sesji jak się użytkownik nazywa i auto go dołączam
  app.post("/api/createRoom/:name", async (req: Request, res: Response) => {
    const room = new Room();
    room.room_name = decodeURIComponent(req.params.name);
    room.participants = req.session.user.name;
    room.has_started = false;
    await connection.manager.save(room);
    const roomList = await connection.manager.find(Room);
    req.session.user.inGame = true;
    res.json(roomList);
  });

  app.get("/api/getRoomList", async (_: Request, res: Response) => {
    const roomList = await connection.manager.find(Room);
    res.json(roomList);
  });

  app.post("/api/joinRoom/:roomID", async (req: Request, res: Response) => {
    console.log(req.session.user.name, " joining room ", req.params.roomID);
  });

  app.use(express.static(path.join(__dirname, "public")));

  app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
};
try {
  main();
} catch (e) {
  console.log(e);
}
// .then(async (connection) => {
//   console.log("Inserting a new user into the database...");
//   const user = new User();
//   user.firstName = "Timber";
//   user.lastName = "Saw";
//   user.age = 25;
//   user.birthplace = "KCH";
//   await connection.manager.save(user);
//   console.log("Saved a new user with id: " + user.id);
//
//   console.log("Loading users from the database...");
//   const users = await connection.manager.find(User);
//   console.log("Loaded users: ", users);
//
//   console.log("Here you can setup and run express/koa/any other framework.");
// })
// .catch((error) => console.log(error));
