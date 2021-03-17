import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";
import OptionalRendering from "./OptionalRendering.js";

let lobbyRefreshInterval: number;

const fetchData = async () => {
  const data = await fetch(`api/room`, {
    method: "POST",
    redirect: "follow",
  });
  const parsedData: RoomInterface = await data.json();
  if (data.redirected) {
    window.location.href = data.url;
  }
  if (parsedData.has_started) {
    clearInterval(lobbyRefreshInterval);
    OptionalRendering.prepareLobbyForGame();
    updateGame();
  }
  return parsedData;
};

const fetchGameData = async () => {
  const data = await fetch(`/game/data`, {
    method: "GET",
    redirect: "follow",
  });
  if (data.redirected) {
    window.location.href = data.url;
  }
  const parsedData = await data.json();
  updateGame();
  return parsedData;
};

let lobby: Lobby;

export const updateGame = async () => {
  const data = await fetchGameData();
  console.log(data);
};

export const updateLobby = async () => {
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
