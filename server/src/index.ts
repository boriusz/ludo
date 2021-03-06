import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import path from "path";
import appRouter from "./routes/routes";
import apiRouter from "./routes/api";

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

app.use(express.static(path.join(__dirname, "public")));

export let connection: Connection;

const createDbConnection = async () => {
  return await createConnection();
};
createDbConnection().then((conn: Connection) => {
  connection = conn;
});

const main = async () => {
  app.listen(PORT);
};
try {
  main().then(() => console.log(`App opened on: http://localhost:${PORT}`));
} catch (e) {
  console.log(e);
}
