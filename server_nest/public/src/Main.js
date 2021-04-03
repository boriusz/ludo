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
const fetchLobbyData = () => __awaiter(void 0, void 0, void 0, function* () {
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
        updateGame();
    }
    return parsedData;
});
const fetchGameData = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(`/game/data`, {
        redirect: "follow",
    });
    if (data.redirected)
        window.location.href = data.url;
    return yield data.json();
});
let lobby;
export let board;
let dice;
const updateBoard = (data) => {
    if (!board) {
        board = new Board(data);
        board.render();
        return;
    }
    board.playersPositions = data;
    board.render();
    if (data.rolledNumber)
        board.renderDice(data.rolledNumber);
};
export const updateGame = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchGameData();
    const { turnStatus } = data;
    updateBoard(data);
    if (!turnStatus) {
        board.removeAllPawns();
        const rollButton = document.querySelector(".roll-button");
        if (rollButton)
            rollButton.remove();
    }
    else {
        if (turnStatus === 1)
            dice.renderRollButton();
        if (turnStatus === 2 && !document.querySelector(".pawn"))
            board.renderTurnView(data.currentTurn, data.rolledNumber);
    }
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield updateGame(); }), 1000);
});
export const updateLobby = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchLobbyData();
    lobby = new Lobby(data);
    lobby.updateHTMLElement();
    return data;
});
updateLobby().then((r) => {
    if (!r.hasStarted)
        lobbyRefreshInterval = window.setInterval(() => updateLobby(), 1000);
});
const readyButton = document.querySelector("#ready-button");
const readyDescription = document.querySelector("#ready-description");
if (readyDescription && readyButton) {
    readyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        readyButton.checked
            ? (readyDescription.innerText = `I'm ready`)
            : (readyDescription.innerText = `I'm waiting`);
        yield fetch(`/room/ready/${readyButton.checked}`, {
            method: "POST",
        });
    }));
}
//# sourceMappingURL=Main.js.map