import "reflect-metadata";
import { Connection, createConnection } from "typeorm";

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
import router from "./routes";

const PORT = process.env.PORT || 4000;
const app = express();

declare module "express-session" {
  export interface SessionData {
    user: { name: string; inGame: boolean; userID: string; gameID?: string };
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

app.use("/", router);

export let connection: Connection;

const createDbConnection = async () => {
  return await createConnection();
};
createDbConnection().then((conn) => {
  connection = conn;
});

const main = async () => {
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
