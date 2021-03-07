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
      const child = document.createElement("li");
      participant.state === 1
        ? (child.style.background = "green")
        : (child.style.background = "red");
      child.innerText = decodeURIComponent(participant.name);
      temporaryList.appendChild(child);
    });
    lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);

    gameStatus.innerText = `started: ${this.hasStarted}`;
  }
}
