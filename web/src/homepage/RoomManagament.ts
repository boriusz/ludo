import { RoomInterface } from "../types";
import RoomHomepage from "./RoomHomepage.js";

const roomContainer = document.querySelector("#room-container")!;

export default class RoomManagament {
  private static serverAddress: string = `http://localhost:4000/api/`;

  public static drawRoomList(roomList: RoomInterface[]) {
    roomContainer.innerHTML = "";
    roomList.forEach((room: RoomInterface) => {
      const newRoom = new RoomHomepage(room);
      roomContainer.appendChild(newRoom.getHTMLElement());
    });
  }

  public static async getRoomList() {
    const address = `${RoomManagament.serverAddress}getRoomList`;
    const roomList = await fetch(address);
    const parsedRoomList: RoomInterface[] = await roomList.json();
    console.log(parsedRoomList);
    return parsedRoomList;
  }

  public static async createNewRoom() {
    const inputElementValue = document.querySelector<HTMLInputElement>(
      "#room-name"
    )?.value;
    let roomName;
    inputElementValue
      ? (roomName = inputElementValue)
      : (roomName = "new room");
    const address = `${
      RoomManagament.serverAddress
    }createRoom/${encodeURIComponent(roomName)}`;
    const response = await fetch(address, {
      method: "POST",
      redirect: "follow",
    });
    if (response.redirected) {
      window.location.href = response.url;
    } else {
      //TODO:  w przyszlosci ladne modale :))
      const errorMessage = await response.json();
      alert(errorMessage);
    }
  }
}
