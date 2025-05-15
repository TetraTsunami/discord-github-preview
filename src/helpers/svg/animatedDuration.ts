import { ColorTheme } from "../../types";
import { fontFamily } from "../card";

export function animatedDuration(strings: string[], x: number, y: number, colors: ColorTheme): string {
  // Each <text> element is rendered at the same position.
  // The first is visible, while the others have opacity 0.
  // At 1s intervals, the current text is set to opacity 0 and the next to opacity 1.
  return strings.map((str, index) => {
    let animations = "";
    if (index === 0) {
      animations = `<set attributeName="opacity" to="0" begin="1s" fill="freeze" />`;
    } else {
      animations = `<set attributeName="opacity" to="1" begin="${index}s" fill="freeze" />` +
        (index < strings.length - 1 ? `<set attributeName="opacity" to="0" begin="${index + 1}s" fill="freeze" />` : "");
    }
    return `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="14" fill="${colors.secondaryText}" opacity="${index === 0 ? 1 : 0}">${str}${animations}</text>`;
  }).join("");
}

export function animatedText(strings: string[], attrs: string): string {
    return strings.map((str, index) => {
    let animations = "";
    if (index === 0) {
      animations = `<set attributeName="opacity" to="0" begin="1s" fill="freeze" />`;
    } else {
      animations = `<set attributeName="opacity" to="1" begin="${index}s" fill="freeze" />` +
        (index < strings.length - 1 ? `<set attributeName="opacity" to="0" begin="${index + 1}s" fill="freeze" />` : "");
    }
    return `<text ${attrs} opacity="${index === 0 ? 1 : 0}">${str}${animations}</text>`;
  }).join("");
}

