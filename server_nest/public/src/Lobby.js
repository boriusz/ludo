var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const lobbyContainer = document.querySelector("#lobby-container");
export default class Lobby {
    constructor({ hasStarted, players }) {
        this.hasStarted = hasStarted;
        this.data = players;
    }
    updateHTMLElement() {
        const temporaryList = document.createElement("ul");
        temporaryList.id = "participants-container";
        const parsedData = this.data;
        const colorsValues = {
            red: 4,
            blue: 3,
            green: 2,
            yellow: 1,
        };
        parsedData.sort((a, b) => colorsValues[b.color] - colorsValues[a.color]);
        parsedData.forEach((participant) => __awaiter(this, void 0, void 0, function* () {
            const listElement = document.createElement("li");
            if (!this.hasStarted) {
                if (!participant.isReady) {
                    listElement.style.border = "3px solid red";
                    listElement.innerText = `${decodeURIComponent(participant.name)} (not ready)`;
                }
                else {
                    listElement.style.border = "3px solid green";
                    listElement.innerText = `${decodeURIComponent(participant.name)} (ready)`;
                }
            }
            else {
                listElement.style.border = "none";
                listElement.innerText = decodeURIComponent(participant.name);
            }
            listElement.className = "user";
            listElement.style.background = participant.color;
            temporaryList.appendChild(listElement);
        }));
        if (lobbyContainer)
            lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
    }
}
//# sourceMappingURL=Lobby.js.map