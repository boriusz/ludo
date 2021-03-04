import { RoomInterface } from "../types";

export default class Lobby {
  private readonly id: number;
  private hasStarted: boolean;
  private participants: string;
  public readonly roomName: string;
  private owner: string;

  constructor({
    id,
    has_started,
    participants,
    room_name,
    owner,
  }: RoomInterface) {
    this.id = id;
    this.hasStarted = has_started;
    this.participants = participants;
    this.roomName = room_name;
    this.owner = owner;
  }

  async checkIfIsOwner() {
    const url = window.location.href;
    const ownershipAuth = await fetch(url + "/owner", {
      method: "POST",
    });
    console.log(await ownershipAuth.json());
  }

  getHTMLElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "lobby-container";

    const list = document.createElement("ul");
    list.className = "participants-container";
    this.participants.split(" ").forEach((participant) => {
      const child = document.createElement("li");
      participant === this.owner
        ? (child.className = "participant")
        : (child.className = "owner");
      child.innerText = decodeURIComponent(participant);
      list.appendChild(child);
    });

    const state = document.createElement("div");
    state.innerText = this.hasStarted.toString();
    state.className = "game-status";

    const owner = document.createElement("button");
    owner.addEventListener("click", async () => {
      await this.checkIfIsOwner();
    });

    container.appendChild(list);
    container.appendChild(state);
    container.appendChild(owner);

    return container;
  }
}
