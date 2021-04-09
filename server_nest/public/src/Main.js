var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Lobby from "./Lobby.js";
import OptionalRendering from "./OptionalRendering.js";
import Board from "./Board.js";
import Dice from "./Dice.js";
let lobbyRefreshInterval;
let lobby;
export let board;
let dice;
export default class DataHandler {
    constructor() {
        DataHandler.updateLobby().then((r) => {
            if (!r.hasStarted) {
                lobbyRefreshInterval = window.setInterval(() => DataHandler.updateLobby(), 1000);
            }
        });
    }
    static fetchLobbyData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(`/room`, {
                redirect: "follow",
            });
            const parsedData = yield data.json();
            if (data.redirected)
                window.location.href = data.url;
            if (parsedData.hasStarted) {
                clearInterval(lobbyRefreshInterval);
                OptionalRendering.prepareLobbyForGame();
                dice = new Dice();
                yield DataHandler.updateGame();
            }
            return parsedData;
        });
    }
    static fetchGameData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(`/game/data`, {
                redirect: "follow",
            });
            if (data.redirected)
                window.location.href = data.url;
            return yield data.json();
        });
    }
    static updateBoard(gameData) {
        if (!board) {
            board = new Board(gameData);
            board.render();
            return;
        }
        board.playersPositions = gameData;
        board.render();
        if (gameData.finished.length > 0)
            lobby.displayMedals(gameData.finished);
        lobby.displayPlayersTimeLeft(gameData.turnTime, gameData.currentTurn);
        if (gameData.rolledNumber)
            board.renderDice(gameData.rolledNumber);
    }
    static updateGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield DataHandler.fetchGameData();
            const { turnStatus } = gameData;
            DataHandler.updateBoard(gameData);
            if (!turnStatus) {
                board.removeAllPawns();
                const rollButton = document.querySelector(".roll-button");
                if (rollButton)
                    rollButton.remove();
            }
            else {
                if (turnStatus === 1)
                    dice.renderRollButton();
                if (turnStatus === 2 && !document.querySelector(".pawn")) {
                    board.renderTurnView(gameData.currentTurn, gameData.rolledNumber);
                }
            }
            if (!gameData.ended) {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield DataHandler.updateGame(); }), 2000);
            }
            else {
                alert("game has ended. placements: " +
                    gameData.finished.map((player) => `${player.player.name}: ${player.placement}`));
                const timerDiv = document.querySelector("#timer-div");
                if (timerDiv)
                    timerDiv.style.display = "none";
            }
        });
    }
    static updateLobby() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DataHandler.fetchLobbyData();
            lobby = new Lobby(data);
            lobby.updateHTMLElement();
            return data;
        });
    }
}
new DataHandler();
const readyButton = document.querySelector("#ready-button");
const readyDescription = document.querySelector("#ready-description");
if (readyDescription && readyButton) {
    readyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        readyButton.checked
            ? (readyDescription.innerText = `I'm ready`)
            : (readyDescription.innerText = `I'm waiting`);
        readyButton.disabled = true;
        yield fetch(`/room/ready?ready=${readyButton.checked}`, {
            method: "POST",
        });
        readyButton.disabled = false;
    }));
}
//# sourceMappingURL=Main.js.map