import { RoomInterface } from "../types";

const url = window.location.href;

export default class RoomHomepage {
  private readonly id: number;
  private hasStarted: boolean;
  private readonly data: string;
  private readonly roomName: string;

  constructor({ id, has_started, data, room_name }: RoomInterface) {
    this.id = id;
    this.hasStarted = has_started;
    this.data = data;
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
    console.log(this.data);
    const parsedData = JSON.parse(this.data);

    parsedData.forEach((participant: string) => {
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
      console.log(url);
      const response = await fetch(`${url}api/joinRoom/${this.id}`, {
        method: "POST",
        redirect: "follow",
      });
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        alert(await response.json());
      }
    });

    const watchButton = document.createElement("button");
    watchButton.innerText = "Watch";
    watchButton.className = "button watch";
    watchButton.addEventListener("click", async () => {
      window.location.href = `${url}api/room/${this.id}`;
    });

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
