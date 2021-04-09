import { Color, Finish, RoomRO } from "../types";

const lobbyContainer = document.querySelector("#lobby-container");
const timerDiv = document.createElement("span");
timerDiv.id = "timer-div";
timerDiv.style.position = "absolute";
timerDiv.style.display = "none";
timerDiv.style.background = "pink";
timerDiv.style.color = "black";
timerDiv.style.width = "1rem";
timerDiv.style.height = "1rem";
if (lobbyContainer) lobbyContainer.appendChild(timerDiv);

// Medals
const medals = [
  "../../images/first-place.png",
  "../../images/second-place.png",
  "../../images/third-place.png",
  "../../images/fourth-place.png",
];

export default class Lobby {
  private readonly hasStarted: boolean;
  private readonly data: { name: string; isReady: boolean; color: Color }[];
  private displayDataInterval: any;

  constructor({ hasStarted, players }: RoomRO) {
    this.hasStarted = hasStarted;
    this.data = players;
  }

  public updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const lobbyData = this.data;
    const colorsValues = {
      red: 4,
      blue: 3,
      green: 2,
      yellow: 1,
    };
    lobbyData.sort(
      (a: { color: Color }, b: { color: Color }) =>
        colorsValues[b.color] - colorsValues[a.color]
    );
    lobbyData.forEach(
      async (participant: { isReady: boolean; name: string; color: Color }) => {
        const listElement = document.createElement("li");

        if (!this.hasStarted) {
          if (!participant.isReady) {
            listElement.style.border = "3px solid red";
            listElement.innerText = `${decodeURIComponent(
              participant.name
            )} (not ready)`;
          } else {
            listElement.style.border = "3px solid green";
            listElement.innerText = `${decodeURIComponent(
              participant.name
            )} (ready)`;
          }
        } else {
          listElement.style.border = "none";
          listElement.innerText = decodeURIComponent(participant.name);
        }

        listElement.className = "user";
        listElement.style.background = participant.color;
        listElement.setAttribute("color", participant.color);

        temporaryList.appendChild(listElement);
      }
    );
    if (lobbyContainer)
      lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
  }

  public displayPlayersTimeLeft(time: Date, color: Color): void {
    clearInterval(this.displayDataInterval);
    const playerContainer = document.querySelector(
      `*[color='${color}']`
    ) as HTMLElement;
    if (playerContainer) {
      this.displayDataInterval = setInterval(() => {
        const elapsedDate = new Date(time).getTime() - Date.now();
        console.log(elapsedDate);
        timerDiv.innerText = Math.floor(
          elapsedDate / 1000 > 0 ? elapsedDate / 1000 : 0
        ).toString();
        timerDiv.style.display = "inline-block";
        timerDiv.style.top = `${playerContainer.offsetTop.toString()}px`;
        timerDiv.style.left = `${playerContainer.offsetLeft.toString()}px`;
      }, 1000);
    }
  }

  public displayMedals(finished: Finish[]): void {
    finished.forEach((item: Finish) => {
      const playerContainer = document.querySelector(
        `*[color='${item.player.color}']`
      ) as HTMLElement;
      if (playerContainer) {
        if (document.querySelector(`*[medal='${item.placement.toString()}']`))
          return;
        playerContainer.style.backgroundImage = `url(${
          medals[item.placement - 1]
        })`;
        playerContainer.style.backgroundRepeat = "no-repeat";
        playerContainer.style.backgroundSize = "contain";
      }
      item.player.color;
    });
  }
}
