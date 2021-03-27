export default class OptionalRendering {
    static prepareLobbyForGame() {
        var _a;
        if (document.querySelector(".game-wrapper"))
            return;
        const readyButton = document.querySelector("#ready-button");
        const readyDescription = document.querySelector("#ready-description");
        const switcher = document.querySelector(".switch");
        const canvasElement = document.createElement("canvas");
        canvasElement.height = 600;
        canvasElement.width = 700;
        const gameWrapper = document.createElement("div");
        gameWrapper.className = "game-wrapper";
        gameWrapper.appendChild(canvasElement);
        if (readyButton && readyDescription && switcher) {
            readyButton.style.display = "none";
            readyDescription.style.display = "none";
            switcher.style.display = "none";
            (_a = document.querySelector(".game-container")) === null || _a === void 0 ? void 0 : _a.appendChild(gameWrapper);
        }
    }
}
//# sourceMappingURL=OptionalRendering.js.map