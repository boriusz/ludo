import { GameData, RoomInterface } from "../types";

const lobbyContainer = document.querySelector(".lobby-container")!;
const gameStatus = <HTMLElement>document.querySelector(".game-status")!;

export default class Lobby {
  private hasStarted: boolean;
  private readonly data: string;
  public readonly roomName: string;

  constructor({ has_started, data, room_name  }: RoomInterface) {
    this.hasStarted = has_started;
    this.data = data;
    this.roomName = room_name;
  }

  async checkIfIsOwner(): Promise<boolean> {
    const url = window.location.href;
    const ownershipAuth = await fetch(url + "/owner", {
      method: "POST",
    });
    return await ownershipAuth.json();
  }

  updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const parsedData = JSON.parse(this.data);
    parsedData.forEach(async (participant: GameData) => {
      const child = document.createElement("li");
      const isOwner = await this.checkIfIsOwner();
      // TODO :tutaj na podstawie tego czy isowner true renderujemy fajne przyciski
      isOwner ? (child.className = "owner") : (child.className = "participant");
      child.innerText = decodeURIComponent(participant.name);
      temporaryList.appendChild(child);
    });
    lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);

    gameStatus.innerText = this.hasStarted.toString();
  }
}
