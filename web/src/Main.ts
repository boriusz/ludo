import Lobby from "./Lobby.js";
import OptionalRendering from "./OptionalRendering.js";
import Board from "./Board.js";
import { GameData } from "../types";
import Dice from "./Dice.js";

let lobbyRefreshInterval: number;

const fetchLobbyData = async () => {
  const data = await fetch(`api/room`, {
    redirect: "follow",
  });
  const parsedData = await data.json();
  if (data.redirected) window.location.href = data.url;
  if (parsedData.hasStarted) {
    clearInterval(lobbyRefreshInterval);
    OptionalRendering.prepareLobbyForGame();
    dice = new Dice();
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
export let board: Board;
let dice: Dice;

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
  const data: GameData = await fetchGameData();
  const { turnStatus } = data;
  Board.removeAllPawns();
  if (!turnStatus) {
    updateBoard(data as GameData);
    const rollButton = document.querySelector(".roll-button");
    if (rollButton) rollButton.parentElement?.removeChild(rollButton);
    return;
  }
  updateBoard(data);
  if (turnStatus === 1) dice.renderRollButton();

  if (turnStatus === 2)
    board.renderTurnView(data.currentTurn, data.rolledNumber);
};

export const updateLobby = async (): Promise<void> => {
  const data = await fetchLobbyData();
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
