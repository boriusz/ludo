import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";

export const currentURL = window.location.href;

const redirectToGame = (url: string) => {
  window.location.href = url;
};

const fetchData = async () => {
  const data = await fetch(currentURL, {
    method: "POST",
    redirect: "follow",
  });
  console.log(data.redirected);
  if (data.redirected) {
    console.log(data.url);
    redirectToGame(data.url);
  }
  const parsedData: RoomInterface = await data.json();
  if (parsedData.time_to_begin) {
    console.log(
      (new Date(parsedData.time_to_begin).getTime() - Date.now()) / 1000
    );
  }
  return parsedData;
};

const header = document.querySelector("#header")!;
let lobby: Lobby;

const updateLobby = async () => {
  const data = await fetchData();
  lobby = new Lobby(data);
  header.innerHTML = `<h1>${lobby.roomName}</h1>`;
  lobby.updateHTMLElement();
};

updateLobby().then(() => {
  window.setInterval(() => updateLobby(), 1000);
});

const leaveHandle = async () => {
  await fetch("/api/leaveRoom", {
    method: "POST",
    redirect: "follow",
  });
};

const readyButton = document.querySelector<HTMLInputElement>("#ready-button")!;
const readyDescription = document.querySelector<HTMLElement>(
  "#ready-description"
)!;

readyButton.addEventListener("click", async () => {
  readyButton.checked
    ? (readyDescription!.innerText = `I'm ready`)
    : (readyDescription!.innerText = `I'm waiting`);
  await fetch(`${currentURL}/ready/${readyButton.checked}`, {
    method: "POST",
  });
});

window.addEventListener("beforeunload", leaveHandle);
