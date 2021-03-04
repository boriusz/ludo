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

window.addEventListener("load", async () => {
  const data = await fetchData();
  const lobby = new Lobby(data);
  lobbyContainer.innerHTML = "";
  lobbyContainer.appendChild(lobby.getHTMLElement());
});

window.setInterval(async () => {
  const data = await fetchData();
  console.log(data);
  const lobby = new Lobby(data);
  lobbyContainer.innerHTML = "";
  lobbyContainer.appendChild(lobby.getHTMLElement());
}, 5000);
