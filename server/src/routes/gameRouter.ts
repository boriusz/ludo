import { Request, Response } from "express";
import { client, connection } from "../index";
import { AutomaticRoom } from "../entity/AutomaticRoom";
import waitForGameDataChange from "../waitForGameDataChange";
import { GameData } from "../types";

const express = require("express");
const gameRouter = express.Router();

gameRouter.get("/data", async (req: Request, res: Response) => {
  const { user } = req.session;
  if (!user) {
    res.redirect("/");
    return;
  }
  const { gameId } = user;
  if (!gameId) {
    res.redirect("/");
    return;
  }
  let gameData = await client.get(gameId.toString());

  /*
  jezeli tura jest naszego usera zwracamy odrazu zeby pokazac mu kostke, i na kliencie nie mam zadnych
  zakolejkowanych requestow ani nic, wszystko wylaczam, i czekam sobie na ruch kostka, wtedy dalej nic nie mam
  czekam na klikniecie piona dopiero potem ruszam piona i wszystkim userom wysylam ten sam response z danymi
  do renderu. calosc interakcji odpywa sie po middleware
  generalnie wysylam info ze jego tura z danymi pozycji jego pionow do renderu ich na ekranie ktore maja
  listenery na odpowiednie akcje i po wykonaniu wszystkich akcji tutaj sie dzieje to co nizej
  rzucam respo ze to jego tura rendery leca, wychodzi kolejne zapytanie o zmiane danych, ktore jest wstrzymywane jak
  reszta.

  jezeli nie to wstrzymujemy do momentu kiedy plansza sie nie zmieni - zapuszczamy co x sekund sprawdzenie do redisa czy cos
  sie zmienilo, jakas zmienna co przechowuje state, jezeli sie zmienilo promise resolve, pobieramy dane i wysylamy

  na piony mamy listenera, ktory po kliku wysyla jego jakies id, na podstawie tego z przechowywanego wyniku
  rzutu kostki zmieniamy pozycje, zapisujemy pozycje do redisa, potem dajemy ze sb cos zmienilo i wtedy reszta dostaje
  zmienione dane

  handle nastepnej tury




   */

  if (gameData) {
    // data already chached
    await waitForGameDataChange(gameId);
    gameData = await client.get(gameId.toString());
    console.log(gameData);
    res.json(JSON.parse(gameData!));
    return;
  }
  const room = await connection.manager.findOne(AutomaticRoom, {
    id: Number(gameId),
  });
  if (!room) {
    res.redirect("/");
    return;
  }
  const parsedData: GameData = JSON.parse(room.data);
  parsedData.hasChanged = true;
  room.data = JSON.stringify(parsedData);
  await connection.manager.save(room);
  await client.set(gameId.toString(), room.data);
  res.json(parsedData);
  return;
});

export default gameRouter;
