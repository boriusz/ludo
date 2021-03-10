import RoomManagament from "./RoomManagament.js";

const createButton = document.querySelector<HTMLInputElement>(
  "#create-button"
)!;

createButton.addEventListener("click", async () => {
  await RoomManagament.createNewRoom();
});

const modalButton = document.querySelector("#button-modal")!;
const modalDiv = document.querySelector<HTMLElement>("#room-modal")!;
const modalCloseButton = document.querySelector("#close-modal")!;
const roomNameInput = document.querySelector<HTMLInputElement>("#room-name")!;

modalButton.addEventListener("click", () => {
  modalDiv.style.display = "flex";
  modalDiv.style.visibility = "visible";
});

modalCloseButton.addEventListener("click", () => {
  modalDiv.style.display = "none";
  modalDiv.style.visibility = "hidden";
  roomNameInput.value = "";
});

window.addEventListener("load", async () => {
  const roomList = await RoomManagament.getRoomList();
  RoomManagament.drawRoomList(roomList);
});

// window.setInterval(async () => {
//   const roomList = await RoomManagament.getRoomList();
//   RoomManagament.drawRoomList(roomList);
// }, 5000);
