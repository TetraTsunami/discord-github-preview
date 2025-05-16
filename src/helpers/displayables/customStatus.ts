import { Activity } from "discord.js";
import { ActivityDisplay, ColorTheme } from "../../types";
import { bannerHeight, fontFamily } from "../card";
import { URItoBase64 } from "../utils";

export const customStatus: ActivityDisplay = {
  height: 0,
  matches: (activity: Activity) => activity.type === 4,
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    const hasEmoji = activity.emoji !== null;
    const hasText = activity.state !== null;
    const xOffset = 220 + (hasEmoji ? 50 : 0);
    const hasCustomEmoji = activity.emoji !== null && activity.emoji.id !== null;
    const emojiSize = hasEmoji && !hasText ? 66 : 34;
    const emojiUrl = hasCustomEmoji && activity.emoji?.imageURL({ size: 64 });
    const emojiName = activity.emoji?.name;

    return `<g>
      <circle cx="220" cy="${bannerHeight - 30}" r="15" style="fill:${colors.secondaryBackground};"/>
      <circle cx="250" cy="${bannerHeight + 5}" r="25" style="fill:${colors.secondaryBackground};"/>
      <rect x="200" y="${bannerHeight + 5}" width="${hasEmoji && !hasText ? 120 : 480}" height="${(activity.state?.length || 80) > 40 ? 90 : 60}" rx="25px" style="fill:${colors.secondaryBackground};"/>
    ${hasCustomEmoji ?
        `<image xlink:href="${await URItoBase64(emojiUrl as string)}" x="220" y="${bannerHeight + 15}" height="${emojiSize}" width="${emojiSize}" />` :
        hasEmoji ?
          `<text style="fill: ${colors.text}; font-family:${fontFamily}; font-size:${emojiSize - 4}px;" x="220" y="${bannerHeight + emojiSize + 10}">${emojiName}</text>`
          : ""}
    ${hasText ? `<foreignObject x="${xOffset}" y="${bannerHeight + 20}" width="${700 - xOffset - 40}" height="60">
      <p xmlns="http://www.w3.org/1999/xhtml" 
      style="color: ${colors.secondaryText}; margin: 0; font-family:${fontFamily}; font-size: 22px; font-style: italic; line-height: 1.2em;">
      ${activity.state}</p>
    </foreignObject>` : ""}
  </g>`;
  }
};
