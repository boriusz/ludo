import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";
import OptionalRendering from "./OptionalRendering.js";

export const currentURL = window.location.href;

const redirectToGame = (url: string) => {
  window.location.href = url;
};

const fetchData = async () => {
  const data = await fetch(currentURL, {
    method: "POST",
    redirect: "follow",
  });
  //
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

const checkIfIsOwner = async () => {
  const ownershipAuth = await fetch(currentURL + "/owner", {
    method: "POST",
  });
  return await ownershipAuth.json();
};

const checkIfIsParticipant = async () => {
  const participantAuth = await fetch(currentURL + "/isParticipant", {
    method: "POST",
  });
  return await participantAuth.json();
};

const updateLobby = async () => {
  if (await checkIfIsParticipant()) OptionalRendering.renderParticipantView();
  if (await checkIfIsOwner()) OptionalRendering.renderOwnerView();
  const data = await fetchData();
  lobby = new Lobby(data);

  header.innerHTML = `<h1>${lobby.roomName}</h1>`;
  lobby.updateHTMLElement();
};

updateLobby();

window.setInterval(() => updateLobby(), 1000);

const leaveHandle = async () => {
  await fetch("/api/leaveRoom", {
    method: "POST",
    redirect: "follow",
  });
};

window.addEventListener("beforeunload", leaveHandle);
