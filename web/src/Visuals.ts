import { RoomInterface } from "./types";
import Room from "./Room.js";

const roomContainer = document.querySelector("#room-container")!;

export default class Visuals {
  public static drawRooms(roomList: RoomInterface[]) {
    roomContainer.innerHTML = "";
    roomList.forEach((room: RoomInterface) => {
      const newRoom = new Room(room);
      roomContainer.appendChild(newRoom.getHTMLElement());
    });
  }
}
