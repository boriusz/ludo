// import { GameData } from "../types";

const lobbyContainer = document.querySelector("#lobby-container")!;

export default class Lobby {
  private hasStarted: boolean;
  private readonly data: string;

  constructor({ has_started, data }: { has_started: boolean; data: string }) {
    this.hasStarted = has_started;
    this.data = data;
  }

  updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const parsedData = JSON.parse(this.data);
    parsedData.forEach(async (participant: any) => {
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
    });
    lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
  }
}
