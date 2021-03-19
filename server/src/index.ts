import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import path from "path";
import appRouter from "./routes/routes";
import apiRouter from "./routes/api";
import gameRouter from "./routes/gameRouter";
import Redis from "ioredis";
import { cleanDatabase, clearDatabase } from "./utils";
import express from "express";
import session from "express-session";

const PORT = process.env.PORT || 4000;
const REDIS_PORT = process.env.PORT || 6379;

export const client = new Redis(Number(REDIS_PORT));

const app = express();

declare module "express-session" {
  export interface SessionData {
    user: {
      name: string;
      inGame: boolean;
      userId: string;
      gameId: number | null;
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

app.use(express.json());

app.use("/", appRouter);
app.use("/api", apiRouter);
app.use("/game", gameRouter);

app.use(express.static(path.join(__dirname, "public")));

export let connection: Connection;

const createDbConnection = async () => await createConnection();

const main = async () => {
  await client.flushall();
  await clearDatabase();
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
