import Lobby from "./Lobby.js";
import Board from "./Board.js";
import { Finish, GameData, RoomRO } from "../types";
import Dice from "./Dice.js";

let lobbyRefreshInterval: number;
let lobby: Lobby;
export let board: Board;
let dice: Dice;

export default class Main {
  constructor() {
    Main.updateLobby().then((r: RoomRO) => {
      if (!r.hasStarted) {
        lobbyRefreshInterval = window.setInterval(
          () => Main.updateLobby(),
          1000
        );
      }
    });
  }

  static async fetchLobbyData(): Promise<RoomRO> {
    const data = await fetch(`/room`, {
      redirect: "follow",
    });
    const parsedData: RoomRO = await data.json();
    if (data.redirected) window.location.href = data.url;
    if (parsedData.hasStarted) {
      clearInterval(lobbyRefreshInterval);
      Lobby.prepareLobbyForGame();
      dice = new Dice();
      await Main.updateGame();
    }
    return parsedData;
  }

  static async fetchGameData(): Promise<GameData> {
    const data = await fetch(`/game/data`, {
      redirect: "follow",
    });
    if (data.redirected) window.location.href = data.url;

    return await data.json();
  }

  static updateBoard(gameData: GameData): void {
    if (!board) {
      board = new Board(gameData);
      board.render();
      return;
    }
    board.playersPositions = gameData;
    board.render();
    if (gameData.finished.length > 0) lobby.displayMedals(gameData.finished);
    lobby.displayPlayersTimeLeft(gameData.turnTime, gameData.currentTurn);
    if (gameData.rolledNumber) board.renderDice(gameData.rolledNumber);
  }

  static async updateGame(): Promise<void> {
    const gameData: GameData = await Main.fetchGameData();
    const { turnStatus } = gameData;
    Main.updateBoard(gameData);
    if (!turnStatus) {
      board.removeAllPawns();
      const rollButton = document.querySelector(".roll-button");
      if (rollButton) rollButton.remove();
    } else {
      if (turnStatus === 1) dice.renderRollButton();
      if (turnStatus === 2 && !document.querySelector(".pawn")) {
        board.renderTurnView(
          gameData.currentTurn,
          gameData.rolledNumber as number
        );
      }
    }
    if (!gameData.ended) {
      setTimeout(async () => await Main.updateGame(), 2000);
    } else {
      alert(
        "game has ended. placements: " +
          gameData.finished.map(
            (player: Finish) => `${player.player.name}: ${player.placement}`
          )
      );
      const timerDiv = document.querySelector("#timer-div") as HTMLElement;
      if (timerDiv) timerDiv.style.display = "none";
    }
  }

  static async updateLobby(): Promise<RoomRO> {
    const data = await Main.fetchLobbyData();
    lobby = new Lobby(data);
    lobby.updateHTMLElement();
    return data;
  }
}

// eslint-disable-next-line no-new
new Main();

const readyButton = document.querySelector<HTMLInputElement>("#ready-button");
const readyDescription = document.querySelector<HTMLElement>(
  "#ready-description"
);

if (readyDescription && readyButton) {
  readyButton.addEventListener("click", async () => {
    readyButton.checked
      ? (readyDescription.innerText = `I'm ready`)
      : (readyDescription.innerText = `I'm waiting`);
    readyButton.disabled = true;
    await fetch(`/room/ready?ready=${readyButton.checked}`, {
      method: "POST",
    });
    readyButton.disabled = false;
  });
}
