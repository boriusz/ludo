import { Request, Response } from "express";
import { AutomaticRoom } from "./entity/AutomaticRoom";
import { connection } from "./index";
import { UserGameData } from "./types";
import { PLAYER_COLORS } from "./constants";

export const joinGame = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.session;
  if (!user) {
    res.redirect("/");
    return;
  }
  const roomList: AutomaticRoom[] = await connection.manager.find(
    AutomaticRoom
  );

  for (const room of roomList) {
    const { data } = room;
    const playersData: UserGameData[] = JSON.parse(data).players;
    if (playersData.length < 4 && !room.hasStarted) {
      const isUserAlreadyInRoom = playersData.find(
        (userInGame: UserGameData) =>
          Object.values(userInGame)[0].userId === user.userId
      );
      if (isUserAlreadyInRoom) {
        console.log("ir noom");
        user.inGame = true;
        user.gameId = room.id;
        return;
      }

      const unavailableColors = playersData.map((player: UserGameData) => {
        const obj = {
          keys: Object.keys(player)[0],
          values: Object.values(player)[0],
        };
        return obj.keys;
      });

      let color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
      while (unavailableColors.find((el: string) => el === color))
        color = PLAYER_COLORS[Math.floor(Math.random() * 4)];

      playersData.push({
        [color]: {
          name: user.name,
          state: 0,
          position: [0, 0, 0, 0],
          userId: user.userId,
        },
      });
      const parsedData = JSON.parse(data);
      parsedData.players = playersData;
      room.data = JSON.stringify(parsedData);
      user.gameId = room.id;
      user.inGame = true;
      await connection.manager.save(room);
      return;
    }
  }

  // There is no room to join so create one
  const room = new AutomaticRoom();
  room.hasStarted = false;
  const id: string = user.userId;
  const color = PLAYER_COLORS[Math.floor(Math.random() * 4)];
  const data = {
    players: [
      {
        [color]: {
          name: user.name,
          state: 0,
          position: [0, 0, 0, 0],
          userId: id,
        },
      },
    ],
  };
  room.data = JSON.stringify(data);
  room.hasStarted = false;
  user.inGame = true;
  const newRoom = await connection.manager.save(room);
  // eslint-disable-next-line require-atomic-updates
  user.gameId = newRoom.id;
  return;
};
