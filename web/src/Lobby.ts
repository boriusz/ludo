import { Color, RoomRO } from "../types";

const lobbyContainer = document.querySelector("#lobby-container");

export default class Lobby {
  private readonly hasStarted: boolean;
  private readonly data: { name: string; isReady: boolean; color: Color }[];

  constructor({ hasStarted, players }: RoomRO) {
    this.hasStarted = hasStarted;
    this.data = players;
  }

  updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const parsedData = this.data;
    const colorsValues = {
      red: 4,
      blue: 3,
      green: 2,
      yellow: 1,
    };
    parsedData.sort(
      (a: { color: Color }, b: { color: Color }) =>
        colorsValues[b.color] - colorsValues[a.color]
    );
    parsedData.forEach(
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

        temporaryList.appendChild(listElement);
      }
    );
    if (lobbyContainer)
      lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
  }
}
