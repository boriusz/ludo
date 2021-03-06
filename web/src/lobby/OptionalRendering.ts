import { currentURL } from "./Main.js";

const participantsContainer = document.querySelector(
  "#participants-container"
)!;

export default class OptionalRendering {
  public static renderParticipantView() {
    console.log("rendering participant view");

    const wrapper = document.createElement("div");
    wrapper.id = "ready-button-wrapper";

    const readyDescription = document.createElement("div");
    readyDescription.id = "ready-description";
    readyDescription.innerText = `I'm waiting`;

    const label = document.createElement("label");
    label.className = "switch";
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.id = "ready-button";

    const span = document.createElement("span");
    span.className = "slider round";

    label.appendChild(input);
    label.appendChild(span);
    wrapper.appendChild(readyDescription);
    wrapper.appendChild(label);

    input.addEventListener("click", async () => {
      input.checked
        ? (readyDescription!.innerText = `I'm ready`)
        : (readyDescription!.innerText = `I'm waiting`);
      await fetch(`${currentURL}/ready/${input.checked}`, {
        method: "POST",
      });
    });

    participantsContainer.insertAdjacentElement("afterend", wrapper);
  }

  public static renderOwnerView() {
    console.log("he is owner man");
  }
}
