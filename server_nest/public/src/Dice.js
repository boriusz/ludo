var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { board } from "./Main.js";
export default class Dice {
    constructor() {
        this.gameWrapper = document.querySelector(".game-wrapper");
        const synth = window.speechSynthesis;
        const interval = setInterval(() => {
            if (synth.getVoices().length !== 0) {
                this.voice = synth.getVoices()[0];
                clearInterval(interval);
            }
        }, 10);
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("/game/roll");
            const parsedResponse = yield response.json();
            const { rolledNumber } = parsedResponse;
            const players = parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.players;
            const currentTurn = parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.currentTurn;
            if (rolledNumber)
                this.rolledNumber = rolledNumber;
            else
                this.rolledNumber = parsedResponse;
            board.renderDice(this.rolledNumber);
            if (players) {
                console.log(rolledNumber);
                board.playersPositions = { players };
                board.renderTurnView(currentTurn, rolledNumber);
            }
        });
    }
    static convertNumberToSentence(num) {
        if (num === 1)
            return "wylosowana liczba: jeden";
        else if (num === 2)
            return "wylosowana liczba: dwa";
        else if (num === 3)
            return "wylosowana liczba: trzy";
        else if (num === 4)
            return "wylosowana liczba: cztery";
        else if (num === 5)
            return "wylosowana liczba: pięć";
        else if (num === 6)
            return "wylosowana liczba: sześć";
        return "achtung";
    }
    speak(rolled) {
        if (rolled) {
            const numberAsText = Dice.convertNumberToSentence(rolled);
            const utterance = new SpeechSynthesisUtterance(numberAsText);
            utterance.voice = this.voice;
            speechSynthesis.speak(utterance);
        }
    }
    renderRollButton() {
        if (document.querySelector(".roll-button"))
            return;
        const rollButton = document.createElement("button");
        rollButton.className = "roll-button";
        rollButton.innerText = "Roll";
        rollButton.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            yield this.roll();
            this.speak(this.rolledNumber);
            const target = e.target;
            target.remove();
        }));
        if (this.gameWrapper)
            this.gameWrapper.prepend(rollButton);
    }
}
//# sourceMappingURL=Dice.js.map