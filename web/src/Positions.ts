import { Color } from "../types";

export default class Positions {
  public static getPositions(
    color: Color,
    positions: number[]
  ): { x: number; y: number }[] | null {
    if (color === "red") {
      return positions.map((position: number, index: number) => {
        if (position === 0) return { ...redPos[0][index], isHome: true };
        if (position > 105) return redPos[105][index];
        if (position >= 100)
          return redPos[position as 100 | 101 | 102 | 103 | 104 | 105][index];
        return redPos?.[position as keyof typeof redPos][index];
      });
    }

    if (color === "blue") {
      return positions.map((position: number, index: number) => {
        if (position === 0) return { ...bluePos[0][index], isHome: true };
        if (position > 105) return bluePos[105][index];
        if (position >= 100)
          return bluePos[position as 100 | 101 | 102 | 103 | 104 | 105][index];
        if (position + 13 > 52)
          return redPos?.[(position - (52 - 13)) as keyof typeof redPos][index];

        return redPos?.[(position + 13) as keyof typeof redPos][index];
      });
    }

    if (color === "green") {
      return positions.map((position: number, index: number) => {
        if (position === 0) return { ...greenPos[0][index], isHome: true };
        if (position > 105) return greenPos[105][index];
        if (position >= 100)
          return greenPos[position as 100 | 101 | 102 | 103 | 104 | 105][index];
        if (position + 26 > 52)
          return redPos?.[(position - (52 - 26)) as keyof typeof redPos][index];
        return redPos?.[(position + 26) as keyof typeof redPos][index];
      });
    }

    if (color === "yellow") {
      return positions.map((position: number, index: number) => {
        if (position === 0) return { ...yellowPos[0][index], isHome: true };
        if (position > 105) return yellowPos[105][index];
        if (position >= 100)
          return yellowPos[position as 100 | 101 | 102 | 103 | 104 | 105][
            index
          ];
        if (position + 39 > 52)
          return redPos?.[(position - (52 - 39)) as keyof typeof redPos][index];
        return redPos?.[(position + 39) as keyof typeof redPos][index];
      });
    }
    return null;
  }
}

const redPos = {
  0: [
    { x: 120, y: 80 },
    { x: 160, y: 120 },
    { x: 120, y: 160 },
    { x: 80, y: 120 },
  ],
  1: [
    { x: 60, y: 260 },
    { x: 60, y: 260 },
    { x: 60, y: 260 },
    { x: 60, y: 260 },
  ],
  2: [
    { x: 100, y: 260 },
    { x: 100, y: 260 },
    { x: 100, y: 260 },
    { x: 100, y: 260 },
  ],
  3: [
    { x: 140, y: 260 },
    { x: 140, y: 260 },
    { x: 140, y: 260 },
    { x: 140, y: 260 },
  ],
  4: [
    { x: 180, y: 260 },
    { x: 180, y: 260 },
    { x: 180, y: 260 },
    { x: 180, y: 260 },
  ],
  5: [
    { x: 220, y: 260 },
    { x: 220, y: 260 },
    { x: 220, y: 260 },
    { x: 220, y: 260 },
  ],
  6: [
    { x: 260, y: 220 },
    { x: 260, y: 220 },
    { x: 260, y: 220 },
    { x: 260, y: 220 },
  ],
  7: [
    { x: 260, y: 180 },
    { x: 260, y: 180 },
    { x: 260, y: 180 },
    { x: 260, y: 180 },
  ],
  8: [
    { x: 260, y: 140 },
    { x: 260, y: 140 },
    { x: 260, y: 140 },
    { x: 260, y: 140 },
  ],
  9: [
    { x: 260, y: 100 },
    { x: 260, y: 100 },
    { x: 260, y: 100 },
    { x: 260, y: 100 },
  ],
  10: [
    { x: 260, y: 60 },
    { x: 260, y: 60 },
    { x: 260, y: 60 },
    { x: 260, y: 60 },
  ],
  11: [
    { x: 260, y: 20 },
    { x: 260, y: 20 },
    { x: 260, y: 20 },
    { x: 260, y: 20 },
  ],
  12: [
    { x: 300, y: 20 },
    { x: 300, y: 20 },
    { x: 300, y: 20 },
    { x: 300, y: 20 },
  ],
  13: [
    { x: 340, y: 20 },
    { x: 340, y: 20 },
    { x: 340, y: 20 },
    { x: 340, y: 20 },
  ],
  14: [
    { x: 340, y: 60 }, /// startowa niebieski
    { x: 340, y: 60 }, /// startowa niebieski
    { x: 340, y: 60 }, /// startowa niebieski
    { x: 340, y: 60 }, /// startowa niebieski
  ],
  15: [
    { x: 340, y: 100 },
    { x: 340, y: 100 },
    { x: 340, y: 100 },
    { x: 340, y: 100 },
  ],
  16: [
    { x: 340, y: 140 },
    { x: 340, y: 140 },
    { x: 340, y: 140 },
    { x: 340, y: 140 },
  ],
  17: [
    { x: 340, y: 180 },
    { x: 340, y: 180 },
    { x: 340, y: 180 },
    { x: 340, y: 180 },
  ],
  18: [
    { x: 340, y: 220 },
    { x: 340, y: 220 },
    { x: 340, y: 220 },
    { x: 340, y: 220 },
  ],
  19: [
    { x: 380, y: 260 },
    { x: 380, y: 260 },
    { x: 380, y: 260 },
    { x: 380, y: 260 },
  ],
  20: [
    { x: 420, y: 260 },
    { x: 420, y: 260 },
    { x: 420, y: 260 },
    { x: 420, y: 260 },
  ],
  21: [
    { x: 460, y: 260 },
    { x: 460, y: 260 },
    { x: 460, y: 260 },
    { x: 460, y: 260 },
  ],
  22: [
    { x: 500, y: 260 },
    { x: 500, y: 260 },
    { x: 500, y: 260 },
    { x: 500, y: 260 },
  ],
  23: [
    { x: 540, y: 260 },
    { x: 540, y: 260 },
    { x: 540, y: 260 },
    { x: 540, y: 260 },
  ],
  24: [
    { x: 580, y: 260 },
    { x: 580, y: 260 },
    { x: 580, y: 260 },
    { x: 580, y: 260 },
  ],
  25: [
    { x: 580, y: 300 },
    { x: 580, y: 300 },
    { x: 580, y: 300 },
    { x: 580, y: 300 },
  ],
  26: [
    { x: 580, y: 340 },
    { x: 580, y: 340 },
    { x: 580, y: 340 },
    { x: 580, y: 340 },
  ],
  27: [
    { x: 540, y: 340 }, /// startowa zielona
    { x: 540, y: 340 }, /// startowa zielona
    { x: 540, y: 340 }, /// startowa zielona
    { x: 540, y: 340 }, /// startowa zielona
  ],
  28: [
    { x: 500, y: 340 },
    { x: 500, y: 340 },
    { x: 500, y: 340 },
    { x: 500, y: 340 },
  ],
  29: [
    { x: 460, y: 340 },
    { x: 460, y: 340 },
    { x: 460, y: 340 },
    { x: 460, y: 340 },
  ],
  30: [
    { x: 420, y: 340 },
    { x: 420, y: 340 },
    { x: 420, y: 340 },
    { x: 420, y: 340 },
  ],
  31: [
    { x: 380, y: 340 },
    { x: 380, y: 340 },
    { x: 380, y: 340 },
    { x: 380, y: 340 },
  ],
  32: [
    { x: 340, y: 380 },
    { x: 340, y: 380 },
    { x: 340, y: 380 },
    { x: 340, y: 380 },
  ],
  33: [
    { x: 340, y: 420 },
    { x: 340, y: 420 },
    { x: 340, y: 420 },
    { x: 340, y: 420 },
  ],
  34: [
    { x: 340, y: 460 },
    { x: 340, y: 460 },
    { x: 340, y: 460 },
    { x: 340, y: 460 },
  ],
  35: [
    { x: 340, y: 500 },
    { x: 340, y: 500 },
    { x: 340, y: 500 },
    { x: 340, y: 500 },
  ],
  36: [
    { x: 340, y: 540 },
    { x: 340, y: 540 },
    { x: 340, y: 540 },
    { x: 340, y: 540 },
  ],
  37: [
    { x: 340, y: 580 },
    { x: 340, y: 580 },
    { x: 340, y: 580 },
    { x: 340, y: 580 },
  ],
  38: [
    { x: 300, y: 580 },
    { x: 300, y: 580 },
    { x: 300, y: 580 },
    { x: 300, y: 580 },
  ],
  39: [
    { x: 260, y: 580 },
    { x: 260, y: 580 },
    { x: 260, y: 580 },
    { x: 260, y: 580 },
  ],
  40: [
    { x: 260, y: 540 }, /// startowa zolta
    { x: 260, y: 540 }, /// startowa zolta
    { x: 260, y: 540 }, /// startowa zolta
    { x: 260, y: 540 }, /// startowa zolta
  ],
  41: [
    { x: 260, y: 500 },
    { x: 260, y: 500 },
    { x: 260, y: 500 },
    { x: 260, y: 500 },
  ],
  42: [
    { x: 260, y: 460 },
    { x: 260, y: 460 },
    { x: 260, y: 460 },
    { x: 260, y: 460 },
  ],
  43: [
    { x: 260, y: 420 },
    { x: 260, y: 420 },
    { x: 260, y: 420 },
    { x: 260, y: 420 },
  ],
  44: [
    { x: 260, y: 380 },
    { x: 260, y: 380 },
    { x: 260, y: 380 },
    { x: 260, y: 380 },
  ],
  45: [
    { x: 220, y: 340 },
    { x: 220, y: 340 },
    { x: 220, y: 340 },
    { x: 220, y: 340 },
  ],
  46: [
    { x: 180, y: 340 },
    { x: 180, y: 340 },
    { x: 180, y: 340 },
    { x: 180, y: 340 },
  ],
  47: [
    { x: 140, y: 340 },
    { x: 140, y: 340 },
    { x: 140, y: 340 },
    { x: 140, y: 340 },
  ],
  48: [
    { x: 100, y: 340 },
    { x: 100, y: 340 },
    { x: 100, y: 340 },
    { x: 100, y: 340 },
  ],
  49: [
    { x: 60, y: 340 },
    { x: 60, y: 340 },
    { x: 60, y: 340 },
    { x: 60, y: 340 },
  ],
  50: [
    { x: 20, y: 340 },
    { x: 20, y: 340 },
    { x: 20, y: 340 },
    { x: 20, y: 340 },
  ],
  51: [
    { x: 20, y: 300 },
    { x: 20, y: 300 },
    { x: 20, y: 300 },
    { x: 20, y: 300 },
  ],
  52: [
    { x: 20, y: 260 },
    { x: 20, y: 260 },
    { x: 20, y: 260 },
    { x: 20, y: 260 },
  ],
  53: [
    { x: 60, y: 260 }, /// czerwona startowa
    { x: 60, y: 260 }, /// czerwona startowa
    { x: 60, y: 260 }, /// czerwona startowa
    { x: 60, y: 260 }, /// czerwona startowa
  ],
  100: [
    { x: 60, y: 300 },
    { x: 60, y: 300 },
    { x: 60, y: 300 },
    { x: 60, y: 300 },
  ],
  101: [
    { x: 100, y: 300 },
    { x: 100, y: 300 },
    { x: 100, y: 300 },
    { x: 100, y: 300 },
  ],
  102: [
    { x: 140, y: 300 },
    { x: 140, y: 300 },
    { x: 140, y: 300 },
    { x: 140, y: 300 },
  ],
  103: [
    { x: 180, y: 300 },
    { x: 180, y: 300 },
    { x: 180, y: 300 },
    { x: 180, y: 300 },
  ],
  104: [
    { x: 220, y: 300 },
    { x: 220, y: 300 },
    { x: 220, y: 300 },
    { x: 220, y: 300 },
  ],
  105: [
    { x: 260, y: 300 },
    { x: 260, y: 300 },
    { x: 260, y: 300 },
    { x: 260, y: 300 },
  ],
};
const bluePos = {
  0: [
    { x: 480, y: 80 },
    { x: 440, y: 120 },
    { x: 480, y: 160 },
    { x: 520, y: 120 },
  ],
  100: [
    { x: 300, y: 60 },
    { x: 300, y: 60 },
    { x: 300, y: 60 },
    { x: 300, y: 60 },
  ],
  101: [
    { x: 300, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 100 },
  ],
  102: [
    { x: 300, y: 140 },
    { x: 300, y: 140 },
    { x: 300, y: 140 },
    { x: 300, y: 140 },
  ],
  103: [
    { x: 300, y: 180 },
    { x: 300, y: 180 },
    { x: 300, y: 180 },
    { x: 300, y: 180 },
  ],
  104: [
    { x: 300, y: 220 },
    { x: 300, y: 220 },
    { x: 300, y: 220 },
    { x: 300, y: 220 },
  ],
  105: [
    { x: 300, y: 260 },
    { x: 300, y: 260 },
    { x: 300, y: 260 },
    { x: 300, y: 260 },
  ],
};
const greenPos = {
  0: [
    { x: 480, y: 520 },
    { x: 440, y: 480 },
    { x: 480, y: 440 },
    { x: 520, y: 480 },
  ],
  100: [
    { x: 540, y: 300 },
    { x: 540, y: 300 },
    { x: 540, y: 300 },
    { x: 540, y: 300 },
  ],
  101: [
    { x: 500, y: 300 },
    { x: 500, y: 300 },
    { x: 500, y: 300 },
    { x: 500, y: 300 },
  ],
  102: [
    { x: 460, y: 300 },
    { x: 460, y: 300 },
    { x: 460, y: 300 },
    { x: 460, y: 300 },
  ],
  103: [
    { x: 420, y: 300 },
    { x: 420, y: 300 },
    { x: 420, y: 300 },
    { x: 420, y: 300 },
  ],
  104: [
    { x: 380, y: 300 },
    { x: 380, y: 300 },
    { x: 380, y: 300 },
    { x: 380, y: 300 },
  ],
  105: [
    { x: 340, y: 300 },
    { x: 340, y: 300 },
    { x: 340, y: 300 },
    { x: 340, y: 300 },
  ],
};
const yellowPos = {
  0: [
    { x: 120, y: 520 },
    { x: 160, y: 480 },
    { x: 120, y: 440 },
    { x: 80, y: 480 },
  ],
  100: [
    { x: 300, y: 540 },
    { x: 300, y: 540 },
    { x: 300, y: 540 },
    { x: 300, y: 540 },
  ],
  101: [
    { x: 300, y: 500 },
    { x: 300, y: 500 },
    { x: 300, y: 500 },
    { x: 300, y: 500 },
  ],
  102: [
    { x: 300, y: 460 },
    { x: 300, y: 460 },
    { x: 300, y: 460 },
    { x: 300, y: 460 },
  ],
  103: [
    { x: 300, y: 420 },
    { x: 300, y: 420 },
    { x: 300, y: 420 },
    { x: 300, y: 420 },
  ],
  104: [
    { x: 300, y: 380 },
    { x: 300, y: 380 },
    { x: 300, y: 380 },
    { x: 300, y: 380 },
  ],
  105: [
    { x: 300, y: 340 },
    { x: 300, y: 340 },
    { x: 300, y: 340 },
    { x: 300, y: 340 },
  ],
};
