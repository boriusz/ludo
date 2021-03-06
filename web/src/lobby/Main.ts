import Lobby from "./Lobby.js";
import { RoomInterface } from "../types";
import OptionalRendering from "./OptionalRendering.js";

export const currentURL = window.location.href;

const fetchData = async () => {
  const data = await fetch(currentURL, {
    method: "POST",
  });
  const parsedData: RoomInterface = await data.json();
  return parsedData;
};

const header = document.querySelector("#header")!;
let lobby: Lobby;
let isParticipant: boolean;
let isOwner: boolean;

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

(async () => {
  isParticipant = await checkIfIsParticipant();
  isOwner = await checkIfIsOwner();
  isParticipant ? OptionalRendering.renderParticipantView() : null;
  isOwner ? OptionalRendering.renderOwnerView() : null;
  const data = await fetchData();
  lobby = new Lobby(data);
  header.innerHTML = `<h1>${lobby.roomName}</h1>`;
  lobby.updateHTMLElement();
})();

window.addEventListener("beforeunload", async () => {
  await fetch("/api/leaveRoom", {
    method: "POST",
    redirect: "follow",
  });
});
