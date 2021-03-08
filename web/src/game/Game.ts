const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = 900;
canvas.height = 900;

const img = new Image();
img.src = "/images/board.png";

img.addEventListener("load", () => {
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
});
const dice = new Path2D();
canvas.onclick = () => {
  dice.rect(10, 10, 100, 100);
  ctx.fillStyle = "red";
  ctx.fill(dice);
};
