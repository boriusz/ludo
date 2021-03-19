import Lobby from "./Lobby.js";
import OptionalRendering from "./OptionalRendering.js";
import Board from "./Board.js";
import { GameData, GameDataWithMove } from "../types";
import Dice from "./Dice.js";

let lobbyRefreshInterval: number;

const fetchData = async () => {
  const data = await fetch(`api/room`, {
    redirect: "follow",
  });
  const parsedData = await data.json();
  if (data.redirected) window.location.href = data.url;
  if (parsedData.hasStarted) {
    clearInterval(lobbyRefreshInterval);
    OptionalRendering.prepareLobbyForGame();
    updateGame();
  }
  return parsedData;
};

const fetchGameData = async () => {
  const data = await fetch(`/game/data`, {
    redirect: "follow",
  });
  if (data.redirected) window.location.href = data.url;

  const parsedData = await data.json();
  updateGame();
  return parsedData;
};

let lobby: Lobby;
let board: Board;

const updateBoard = (data: GameData) => {
  if (!board) {
    board = new Board(data);
    board.render();
    return;
  }
  board.playersPositions = data;
  board.render();
};

export const updateGame = async (): Promise<void> => {
  const data: GameData | GameDataWithMove = await fetchGameData();
  const { moveType } = data as GameDataWithMove;
  if (!moveType) {
    updateBoard(data as GameData);
    return;
  }
  const { parsedGameData } = data as GameDataWithMove;
  updateBoard(parsedGameData);
  if (moveType === 1) console.log(await Dice.roll());
};

export const updateLobby = async (): Promise<void> => {
  const data = await fetchData();
  lobby = new Lobby(data);
  lobby.updateHTMLElement();
};

updateLobby().then(() => {
  lobbyRefreshInterval = window.setInterval(() => updateLobby(), 1000);
});

const readyButton = document.querySelector<HTMLInputElement>("#ready-button");
const readyDescription = document.querySelector<HTMLElement>(
  "#ready-description"
);

if (readyDescription && readyButton) {
  readyButton.addEventListener("click", async () => {
    readyButton.checked
      ? (readyDescription.innerText = `I'm ready`)
      : (readyDescription.innerText = `I'm waiting`);
    await fetch(
      `http://192.168.1.8:4000/api/room/ready/${readyButton.checked}`,
      {
        method: "POST",
      }
    );
  });
}

// window.addEventListener("unload", leaveHandle);
