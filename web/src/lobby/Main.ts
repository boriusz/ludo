import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";

const currentURL = window.location.href;

const fetchData = async () => {
  const data = await fetch(currentURL, {
    method: "POST",
  });
  const parsedData: RoomInterface = await data.json();
  return parsedData;
};

const lobbyContainer = document.querySelector("#lobby-wrapper")!;
const header = document.querySelector("#header")!;
let lobby: Lobby

(async () => {
  const data = await fetchData();
  lobby = new Lobby(data);
  header.innerHTML = `<h1>${lobby.roomName}</h1>`;
  const managemenetButtonContainer = document.createElement("div");
  lobbyContainer.appendChild(managemenetButtonContainer);
  lobby.updateHTMLElement();
})();

window.setInterval(async () => {
  const data = await fetchData();
  lobby = new Lobby(data);
  lobby.updateHTMLElement();
}, 5000);

window.addEventListener("beforeunload", async () => {
  await fetch("/api/leaveRoom", {
    method: "POST",
    redirect: "follow",
  });
});
