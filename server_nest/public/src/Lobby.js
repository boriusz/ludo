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
const timerDiv = document.createElement("span");
timerDiv.id = "timer-div";
timerDiv.style.position = "absolute";
timerDiv.style.display = "none";
timerDiv.style.background = "pink";
timerDiv.style.color = "black";
timerDiv.style.width = "1rem";
timerDiv.style.height = "1rem";
if (lobbyContainer)
    lobbyContainer.appendChild(timerDiv);
const medals = [
    "../../images/first-place.png",
    "../../images/second-place.png",
    "../../images/third-place.png",
    "../../images/fourth-place.png",
];
export default class Lobby {
    constructor({ hasStarted, players }) {
        this.hasStarted = hasStarted;
        this.data = players;
    }
    updateHTMLElement() {
        const temporaryList = document.createElement("ul");
        temporaryList.id = "participants-container";
        const lobbyData = this.data;
        const colorsValues = {
            red: 4,
            blue: 3,
            green: 2,
            yellow: 1,
        };
        lobbyData.sort((a, b) => colorsValues[b.color] - colorsValues[a.color]);
        lobbyData.forEach((participant) => __awaiter(this, void 0, void 0, function* () {
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
            listElement.setAttribute("color", participant.color);
            temporaryList.appendChild(listElement);
        }));
        if (lobbyContainer)
            lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
    }
    displayPlayersTimeLeft(time, color) {
        const playerContainer = document.querySelector(`*[color='${color}']`);
        if (playerContainer) {
            timerDiv.innerText = Math.floor(time / 1000).toString();
            timerDiv.style.display = "inline-block";
            timerDiv.style.top = `${playerContainer.offsetTop.toString()}px`;
            timerDiv.style.left = `${playerContainer.offsetLeft.toString()}px`;
        }
    }
    displayMedals(finished) {
        finished.forEach((item) => {
            const playerContainer = document.querySelector(`*[color='${item.player.color}']`);
            if (playerContainer) {
                if (document.querySelector(`*[medal='${item.placement.toString()}']`))
                    return;
                playerContainer.style.backgroundImage = `url(${medals[item.placement - 1]})`;
                playerContainer.style.backgroundRepeat = "no-repeat";
                playerContainer.style.backgroundSize = "contain";
            }
            item.player.color;
        });
    }
}
//# sourceMappingURL=Lobby.js.map