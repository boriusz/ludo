import { GameData, RoomInterface } from "../types";

const lobbyContainer = document.querySelector("#lobby-container")!;
const gameStatus = <HTMLElement>document.querySelector("#game-status")!;

export default class Lobby {
  private hasStarted: boolean;
  private readonly data: string;
  public readonly roomName: string;

  constructor({ has_started, data, room_name }: RoomInterface) {
    this.hasStarted = has_started;
    this.data = data;
    this.roomName = room_name;
  }

  updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const parsedData = JSON.parse(this.data);
    parsedData.forEach(async (participant: GameData) => {
      const listElement = document.createElement("li");

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

      listElement.className = "user";
      listElement.style.background = participant.color;

      temporaryList.appendChild(listElement);
    });
    lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);

    gameStatus.innerText = `started: ${this.hasStarted}`;
  }
}
