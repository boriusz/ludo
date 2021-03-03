import RoomManagament from "./RoomManagament.js";
import Visuals from "./Visuals.js";

const createButton = document.querySelector<HTMLInputElement>(
  "#create-button"
)!;

createButton.addEventListener("click", async () => {
  const data = await RoomManagament.createNewRoom();
  Visuals.drawRooms(data);
});

window.addEventListener("load", async () => {
  const roomList = await RoomManagament.getRoomList();
  Visuals.drawRooms(roomList);
});

window.setInterval(async () => {
  const roomList = await RoomManagament.getRoomList();
  Visuals.drawRooms(roomList);
}, 5000);
