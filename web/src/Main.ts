import Lobby from "./Lobby.js";
import OptionalRendering from "./OptionalRendering.js";
import Board from "./Board.js";
import { GameData, RoomRO } from "../types";
import Dice from "./Dice.js";

let lobbyRefreshInterval: number;

const fetchLobbyData = async (): Promise<RoomRO> => {
  const data = await fetch(`/room`, {
    redirect: "follow",
  });
  const parsedData: RoomRO = await data.json();
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

  return await data.json();
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
  if (data.rolledNumber) board.renderDice(data.rolledNumber);
};

export const updateGame = async (): Promise<void> => {
  const data: GameData = await fetchGameData();
  const { turnStatus } = data;
  updateBoard(data);
  if (!turnStatus) {
    board.removeAllPawns();
    const rollButton = document.querySelector(".roll-button");
    if (rollButton) rollButton.remove();
  } else {
    if (turnStatus === 1) dice.renderRollButton();
    if (turnStatus === 2 && !document.querySelector(".pawn"))
      board.renderTurnView(data.currentTurn, data.rolledNumber);
  }
  setTimeout(async () => await updateGame(), 1000);
};

export const updateLobby = async (): Promise<RoomRO> => {
  const data = await fetchLobbyData();
  lobby = new Lobby(data);
  lobby.updateHTMLElement();
  return data;
};

updateLobby().then((r: RoomRO) => {
  if (!r.hasStarted)
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
    await fetch(`http://192.168.1.8:4000/room/ready/${readyButton.checked}`, {
      method: "POST",
    });
  });
}

// window.addEventListener("unload", leaveHandle);
