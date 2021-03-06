import RoomManagament from "./RoomManagament.js";

const createButton = document.querySelector<HTMLInputElement>(
  "#create-button"
)!;

createButton.addEventListener("click", async () => {
  await RoomManagament.createNewRoom();
});

window.addEventListener("load", async () => {
  const roomList = await RoomManagament.getRoomList();
  RoomManagament.drawRoomList(roomList);
});

window.setInterval(async () => {
  const roomList = await RoomManagament.getRoomList();
  RoomManagament.drawRoomList(roomList);
}, 5000);
