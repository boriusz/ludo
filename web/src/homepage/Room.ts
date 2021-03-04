import { RoomInterface } from "../types";

export default class Room {
  private readonly id: number;
  private hasStarted: boolean;
  private participants: string;
  private readonly roomName: string;

  constructor({ id, has_started, participants, room_name }: RoomInterface) {
    this.id = id;
    this.hasStarted = has_started;
    this.participants = participants;
    this.roomName = room_name;
  }

  getHTMLElement(): HTMLElement {
    let participantsCounter = 0;
    const container: HTMLElement = document.createElement("div");
    container.setAttribute("roomID", this.id.toString());
    container.className = "room";

    const name = document.createElement("div");
    name.className = "room-name";
    name.innerText = this.roomName;

    const participantsList = document.createElement("ul");
    participantsList.className = "participants-container";
    this.participants.split(" ").forEach((participant) => {
      participantsCounter++;
      const li = document.createElement("li");
      li.className = "participant-item";
      li.innerText = decodeURIComponent(participant);
      participantsList.appendChild(li);
    });
    const counter = document.createElement("div");
    counter.innerText = `${participantsCounter}/4`;
    counter.className = "participants-number";

    const startedMarker = document.createElement("div");
    startedMarker.innerText = this.hasStarted.toString();
    startedMarker.className = "room-has-started";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const joinButton = document.createElement("button");
    joinButton.innerText = "Join";
    joinButton.className = "button join";
    joinButton.addEventListener("click", async () => {
      const response = await fetch(
        `http://localhost:4000/api/joinRoom/${this.id}`,
        {
          method: "POST",
          redirect: "follow",
        }
      );
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        alert(await response.json());
      }
    });

    const watchButton = document.createElement("button");
    watchButton.innerText = "Watch";
    watchButton.className = "button watch";

    buttonContainer.appendChild(joinButton);
    buttonContainer.appendChild(watchButton);

    container.appendChild(name);
    container.appendChild(participantsList);
    container.appendChild(startedMarker);
    container.appendChild(counter);
    container.appendChild(buttonContainer);

    return container;
  }
}
