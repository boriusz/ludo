var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Positions from "./Positions.js";
const boardBg = new Image();
boardBg.src = "../../images/board.png";
const diceImg = new Image();
diceImg.src = "../../images/dice.png";
export default class Board {
    constructor(data) {
        this.gameWrapper = document.querySelector(".game-wrapper");
        const canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        const context = canvas.getContext("2d");
        if (!context)
            return;
        this.context = context;
        this.context.drawImage(boardBg, 100, 0, 600, 600);
        this._playersPositions = data.players.map((player) => {
            const obj = {
                color: player.color,
                data: player.positions,
            };
            return { [obj.color]: obj.data };
        });
    }
    set playersPositions(data) {
        this._playersPositions = data.players.map((player) => {
            const obj = {
                color: player.color,
                data: player.positions,
            };
            return { [obj.color]: obj.data };
        });
    }
    drawCircle(x, y, color) {
        const { context } = this;
        context.beginPath();
        context.arc(x + 100, y, 15, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }
    render() {
        this.context.clearRect(0, 0, 700, 600);
        this.context.drawImage(boardBg, 100, 0, 600, 600);
        this._playersPositions.forEach((player) => {
            const obj = {
                color: Object.keys(player)[0],
                positions: player[Object.keys(player)[0]],
            };
            const positions = Positions.getPositions(obj.color, obj.positions);
            if (!positions)
                return;
            for (const position of positions)
                if (position)
                    this.drawCircle(position.x, position.y, obj.color);
        });
    }
    renderDice(rolled) {
        this.context.drawImage(diceImg, (rolled - 1) * 64, 3 * 64, 64, 64, 18, (600 - 64) / 2, 64, 64);
    }
    removeAllPawns() {
        const pawns = document.querySelectorAll(".pawn");
        pawns.forEach((pawn) => {
            pawn.remove();
        });
        const possibleDivs = document.querySelectorAll(".possible-pawn");
        if (possibleDivs)
            Array.from(possibleDivs).forEach((child) => child.remove());
    }
    renderTurnView(currentTurn, rolledNumber) {
        const currentPlayer = this._playersPositions.find((position) => Object.keys(position)[0] === currentTurn);
        if (!currentPlayer)
            return;
        const positions = Positions.getPositions(currentTurn, currentPlayer[currentTurn]);
        positions === null || positions === void 0 ? void 0 : positions.forEach((position, index) => {
            var _a;
            if (!position)
                return;
            if (rolledNumber !== 1 && rolledNumber !== 6 && position.isHome)
                return;
            if (currentPlayer[currentTurn][index] + rolledNumber > 105)
                return;
            const pawn = document.createElement("div");
            pawn.className = "pawn";
            pawn.style.top = (position.y - 20).toString() + "px";
            pawn.style.left = (position.x + 80).toString() + "px";
            setInterval(() => {
                pawn.classList.toggle("pawn-blink");
            }, 500);
            pawn.onmouseover = () => {
                var _a;
                const elapsedPositions = currentPlayer[currentTurn].map((item) => {
                    if (item === 0 && (rolledNumber === 1 || rolledNumber || 6))
                        return 1;
                    if (item + rolledNumber > 51 && item < 100)
                        return item + rolledNumber - 52 + 100;
                    return item + rolledNumber;
                });
                const possibleNextPosition = Positions.getPositions(currentTurn, elapsedPositions);
                const nextPosition = possibleNextPosition === null || possibleNextPosition === void 0 ? void 0 : possibleNextPosition[index];
                if (nextPosition) {
                    const possiblePawn = document.createElement("div");
                    possiblePawn.className = "possible-pawn";
                    possiblePawn.style.top = (nextPosition.y - 20).toString() + "px";
                    possiblePawn.style.left = (nextPosition.x + 80).toString() + "px";
                    (_a = this.gameWrapper) === null || _a === void 0 ? void 0 : _a.appendChild(possiblePawn);
                }
            };
            pawn.onmouseleave = () => {
                const possibleDivs = document.querySelectorAll(".possible-pawn");
                if (possibleDivs) {
                    Array.from(possibleDivs).forEach((child) => child.remove());
                }
            };
            pawn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const headers = { "Content-Type": "application/json" };
                yield fetch(`/game/movePawn?pawnId=${index}`, {
                    method: "put",
                    headers,
                });
                this.removeAllPawns();
            }));
            (_a = this.gameWrapper) === null || _a === void 0 ? void 0 : _a.appendChild(pawn);
        });
    }
}
//# sourceMappingURL=Board.js.map