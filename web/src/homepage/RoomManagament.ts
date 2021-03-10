import { RoomInterface } from "../types";
import RoomRender from "./RoomRender.js";

const roomContainer = document.querySelector("#room-container")!;

export default class RoomManagament {
  private static serverAddress: string = window.location.href + "api/";

  public static drawRoomList(roomList: RoomInterface[]) {
    roomContainer.innerHTML = "";
    roomList.forEach((room: RoomInterface) => {
      const newRoom = new RoomRender(room);
      roomContainer.appendChild(newRoom.getHTMLElement());
    });
  }

  public static async getRoomList() {
    const address = `${RoomManagament.serverAddress}getRoomList`;
    const roomList = await fetch(address, { redirect: "follow" });
    if (roomList.redirected) {
      window.location.href = roomList.url;
    }
    const parsedRoomList: RoomInterface[] = await roomList.json();
    return parsedRoomList;
  }

  public static async createNewRoom() {
    const roomNameValue = document.querySelector<HTMLInputElement>("#room-name")
      ?.value;
    const roomPasswordValue = document.querySelector<HTMLInputElement>(
      "#room-password"
    )!.value;
    let roomName;
    roomNameValue ? (roomName = roomNameValue) : (roomName = "new room");
    const address = `${RoomManagament.serverAddress}/createRoom`;
    const data = JSON.stringify({
      name: roomName,
      password: roomPasswordValue,
    });
    const response = await fetch(address, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      redirect: "follow",
      body: data,
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
