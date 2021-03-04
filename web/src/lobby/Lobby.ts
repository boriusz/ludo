import { RoomInterface } from "../types";

export default class Lobby {
  private readonly id: number;
  private hasStarted: boolean;
  private participants: string;
  private readonly roomName: string;
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

  checkIfIsOwner(): boolean {
    // TODO: tutaj sobie sprawdzam czy aktualny jest ownerem z serwera i dalej na podstawie tego renderuje odpowiednie przyciski itd.
    return false
  }

  getHTMLElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "lobby-container";

    const roomName = document.createElement("h1");
    roomName.innerText = this.roomName;
    roomName.className = "room-name";

    const list = document.createElement("ul");
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

    container.appendChild(roomName);
    container.appendChild(list);
    container.appendChild(state);

    return container;
  }
}
