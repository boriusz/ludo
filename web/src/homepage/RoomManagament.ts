import { RoomInterface } from "../types";

export default class RoomManagament {
  private static serverAddress: string = `http://localhost:4000/api/`;

  public static async getRoomList() {
    const address = `${RoomManagament.serverAddress}getRoomList`;
    const roomList = await fetch(address);
    const parsedRoomList: RoomInterface[] = await roomList.json();
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
    const address = `${RoomManagament.serverAddress}createRoom/${roomName}`;
    const response = await fetch(address, {
      method: "POST",
      redirect: "follow",
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  }
}
