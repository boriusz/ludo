import { ColorType } from "../types";

const lobbyContainer = document.querySelector("#lobby-container");

export default class Lobby {
  private readonly hasStarted: boolean;
  private readonly data: string;

  constructor({ hasStarted, data }: { hasStarted: boolean; data: string }) {
    this.hasStarted = hasStarted;
    this.data = data;
  }

  updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const parsedData = JSON.parse(this.data);
    const colorsValues = {
      red: 4,
      blue: 3,
      green: 2,
      yellow: 1,
    };
    parsedData.sort(
      (a: { color: ColorType }, b: { color: ColorType }) =>
        colorsValues[b.color] - colorsValues[a.color]
    );
    parsedData.forEach(
      async (participant: { state: number; name: string; color: string }) => {
        const listElement = document.createElement("li");

        if (!this.hasStarted) {
          if (participant.state === 0) {
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