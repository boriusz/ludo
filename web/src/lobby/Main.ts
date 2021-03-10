import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";
import OptionalRendering from "./OptionalRendering.js";

let lobbyRefreshInterval: number;
export const currentURL = window.location.href;

const redirectToGame = (url: string) => {
  window.location.href = url;
};

const fetchData = async () => {
  const data = await fetch(currentURL, {
    method: "POST",
    redirect: "follow",
  });
  if (data.redirected) {
    redirectToGame(data.url);
  }
  const parsedData: RoomInterface = await data.json();
  if (parsedData.has_started) {
    clearInterval(lobbyRefreshInterval);
    OptionalRendering.prepareLobbyForGame();
  }
  return parsedData;
};

let lobby: Lobby;

const updateLobby = async () => {
  const data = await fetchData();
  lobby = new Lobby(data);
  lobby.updateHTMLElement();
};

updateLobby().then(() => {
  lobbyRefreshInterval = window.setInterval(() => updateLobby(), 1000);
});

const readyButton = document.querySelector<HTMLInputElement>("#ready-button")!;
const readyDescription = document.querySelector<HTMLElement>(
  "#ready-description"
)!;

readyButton.addEventListener("click", async () => {
  readyButton.checked
    ? (readyDescription!.innerText = `I'm ready`)
    : (readyDescription!.innerText = `I'm waiting`);
  await fetch(`http://192.168.1.8:4000/api/room/ready/${readyButton.checked}`, {
    method: "POST",
  });
});

// window.addEventListener("unload", leaveHandle);
