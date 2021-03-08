import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import path from "path";
import appRouter from "./routes/routes";
import apiRouter from "./routes/api";
import gameRouter from "./routes/gameRouter";
import { Room } from "./entity/Room";

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const PORT = process.env.PORT || 4000;
const app = express();

declare module "express-session" {
  export interface SessionData {
    user: {
      name: string;
      inGame: boolean;
      userID: string;
      gameID?: string | null;
    };
  }
}

app.use(
  session({
    secret: "somebigbrainsecretkeythatnoonewillguess",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 godzina
  })
);

app.use(bodyParser({ extended: true }));

app.use("/", appRouter);
app.use("/api", apiRouter);
app.use("/game", gameRouter);

app.use(express.static(path.join(__dirname, "public")));

export let connection: Connection;

const createDbConnection = async () => {
  return await createConnection();
};

const cleanDatabase = async () => {
  const rooms: Room[] = await connection.manager.find(Room);
  for (const room of rooms) {
    const roomInactiveFor = Date.now() - room.updated_at.getTime();
    console.log(roomInactiveFor, room);
    if (roomInactiveFor > 1000 * 60 * 5 && !room.has_started) {
      // 5 minutes inactive => delete room
      await connection.manager.delete(Room, {
        id: room.id,
      });
    }
  }
};

const main = async () => {
  await cleanDatabase();
  setInterval(() => cleanDatabase(), 1000 * 30); // check for inactive rooms every 30s
  app.listen(PORT);
};
try {
  createDbConnection()
    .then((conn: Connection) => {
      connection = conn;
    })
    .then(() => main())
    .then(() => console.log(`App opened on: http://localhost:${PORT}`));
} catch (e) {
  console.log(e);
}
