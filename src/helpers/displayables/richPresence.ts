import { Activity } from "discord.js";
import { ActivityDisplay, ColorTheme } from "../../types";
import { fontFamily, sanitizeString } from "../card";
import { timestampSVG } from "../svg/timestamp";
import { URItoBase64 } from "../utils";
import { roundImageSize } from "../discord";

export const richPresence: ActivityDisplay = {
  height: 140,
  matches: (activity: Activity) => !!(activity.details || activity.state || activity.assets),
  render: async function (activity: Activity, colors: ColorTheme, y: number, width: number): Promise<string> {
    // Get image URLs, then convert them to base64. URLs are stored separately to check that they exist before converting
    const largeImageURL = activity.assets?.largeImageURL({ size: roundImageSize(width / 4), extension: "webp" });
    const smallImageURL = activity.assets?.smallImageURL({ size: roundImageSize(width / 16), extension: "webp" });
    let largeImage = largeImageURL && URItoBase64(largeImageURL);
    let smallImage = smallImageURL && URItoBase64(smallImageURL);
    if (!largeImage && smallImage) {
      largeImage = smallImage;
      smallImage = null;
    }
    const timestamps = activity.timestamps;
    const detailLines = [activity.details, activity.state].filter(Boolean);
    const textY = y + 30;
    const textX = 170;
    const smallCenter = [140, 115];
    // Final SVG bits
    return `<g>
      <rect x="20" y="${y}" width="660" height="140" rx="15" style="fill:${colors.secondaryBackground};"/>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:24px;font-weight:600;" x="${textX}" y="${textY}">${sanitizeString(activity.name)}</text>
      ${detailLines.map((line, i) => `<text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 20px;" x="${textX}" y="${textY + 30 + (i * 30)}">${sanitizeString(line || "")}</text>`).join("")}
      ${timestamps ? timestampSVG(textX, textY + (detailLines.length * 30), colors, timestamps.start?.getTime(), timestamps.end?.getTime(), true) : ""}
      ${largeImage ?
        `<image xlink:href="${await largeImage}" x="30" y="${y + 10}" height="120" width="120" clip-path="inset(0% round 5px)" />`
        : ""}
      ${smallImage &&
      `<rect x="${smallCenter[0] - 22}" y="${y + smallCenter[1] - 22}" width="44" height="44" rx="100%" style="fill:${colors.secondaryBackground};"/>
        <image xlink:href="${await smallImage}" x="${smallCenter[0] - 19}" y="${y + smallCenter[1] - 19}" height="38" width="38" clip-path="circle()" />`
      || ""}
    </g>`;
  }
};
