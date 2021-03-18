import { ColorType } from "../types";
const getPositions = (color: ColorType, positions: number[]) => {
  if (color === "red") {
    return positions.map((_position: number, index: number) => {
      return redPos.home[index];
    });
  }
  if (color === "blue") {
    return positions.map((_position: number, index: number) => {
      return bluePos.home[index];
    });
  }
  if (color === "green") {
    return positions.map((_position: number, index: number) => {
      return greenPos.home[index];
    });
  }
  if (color === "yellow") {
    return positions.map((_position: number, index: number) => {
      return yellowPos.home[index];
    });
  } else return;
};

const redPos = {
  home: [
    { x: 120, y: 80 },
    { x: 160, y: 120 },
    { x: 120, y: 160 },
    { x: 80, y: 120 },
  ],
};
const bluePos = {
  home: [
    { x: 480, y: 80 },
    { x: 440, y: 120 },
    { x: 480, y: 160 },
    { x: 520, y: 120 },
  ],
};
const greenPos = {
  home: [
    { x: 480, y: 520 },
    { x: 440, y: 480 },
    { x: 480, y: 440 },
    { x: 520, y: 480 },
  ],
};
const yellowPos = {
  home: [
    { x: 120, y: 520 },
    { x: 160, y: 480 },
    { x: 120, y: 440 },
    { x: 80, y: 480 },
  ],
};
export default getPositions;
