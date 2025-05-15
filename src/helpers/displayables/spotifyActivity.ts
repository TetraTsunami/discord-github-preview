import { Activity } from "discord.js";
import { ActivityDisplay, ColorTheme } from "../../types";
import { fontFamily, sanitizeString } from "../card";
import { spotifyGreen } from "../themes";
import { URItoBase64, truncate, formatDuration } from "../utils";
import { animatedDuration } from "../svg/animatedDuration";

// Spotify-specific activity handler with album art and progress bar
export const spotifyActivity: ActivityDisplay = {
  height: 140,
  matches: (activity: Activity) => activity.name === "Spotify",
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    // Get album art
    const albumArtURL = activity.assets?.largeImageURL({ size: 256, extension: "webp" });
    const albumArt = albumArtURL && URItoBase64(albumArtURL);
    const songName = truncate(activity.details || "Unknown Song", 25);
    const artistName = truncate(activity.state || "Unknown Artist", 30);
    const albumName = truncate(activity.assets?.largeText || "Unknown Album", 35);
    const uniqueId = `spotify-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // avoid SVG conflicts
    const textY = y + 35;
    const textX = 170;
    // Calculate progress bar if timestamps are available
    const timestamps = activity.timestamps;
    const hasTimestamps = timestamps && timestamps.start && timestamps.end;
    let progressBar = "";
    let duration = "";
    let progress = 0;

    if (hasTimestamps) {
      const startTime = timestamps.start?.getTime() || 0;
      const endTime = timestamps.end?.getTime() || 0;
      const currentTime = Date.now();
      progress = Math.min((currentTime - startTime) / (endTime - startTime), 1);
      const currentPosition = formatDuration(currentTime - startTime);
      const totalDuration = formatDuration(endTime - startTime);
      duration = `${currentPosition} / ${totalDuration}`;
      const durationValues: string[] = [];
      for (let i = 0; i < 30; i++) {
        const futureTime = currentTime - startTime + i * 1000;
        durationValues.push(`${formatDuration(futureTime)} / ${totalDuration}`);
        if (futureTime > endTime - startTime) break; // allow one extra second so we can get to 100%
      }
      const animatedDurationSVG = animatedDuration(durationValues, textX, textY + 90, colors);
      progressBar = `
				<rect x="${textX}" y="${textY + 65}" width="490" height="4" rx="2" style="fill:${colors.tertiaryBackground};"/>
				<rect x="${textX}" y="${textY + 65}" width="${490 * progress}" height="4" rx="2" style="fill:${spotifyGreen};">
					<animate attributeName="width" from="${490 * progress}" to="490" begin="0s" dur="${Math.max((endTime - currentTime) / 1000, 0)}s" fill="freeze" />
				</rect>
				${animatedDurationSVG}
			`;
    }
    const smallCenter = [140, 115];
    return `<g>
      <rect x="20" y="${y}" width="660" height="140" rx="15" style="fill:${colors.secondaryBackground};"/>
      ${albumArt ?
        `<clipPath id="albumArtClip-${uniqueId}">
           <rect x="30" y="${y + 10}" width="120" height="120" rx="6"/>
         </clipPath>
         <g clip-path="url(#albumArtClip-${uniqueId})">
           <image xlink:href="${await albumArt}" x="30" y="${y + 10}" height="120" width="120" />
         </g>` :
        `<rect x="30" y="${y + 10}" width="120" height="120" rx="6" style="fill:#333333;"/>`}
      <rect x="${smallCenter[0] - 22}" y="${y + smallCenter[1] - 22}" width="44" height="44" rx="100%" style="fill:${colors.secondaryBackground};"/>
      <circle cx="${smallCenter[0]}" cy="${y + smallCenter[1]}" r="19" fill="${spotifyGreen}"/>
      <path transform="translate(${smallCenter[0]} ${y + smallCenter[1]}) scale(3.5) translate(-41.8 -1.5)" d="M44.9 1c-1.6-1-4.3-1.1-5.8-0.6-0.3 0.1-0.5-0.1-0.6-0.3-0.1-0.3 0.1-0.5 0.3-0.6 1.8-0.5 4.7-0.4 6.6 0.7 0.2 0.1 0.3 0.4 0.2 0.6-0.1 0.2-0.4 0.3-0.7 0.2zm-0.3 1.5c-0.1 0.2-0.4 0.3-0.6 0.1-1.3-0.8-3.4-1.1-4.9-0.6-0.2 0-0.5 0-0.5-0.2-0.1-0.2 0-0.5 0.2-0.5 1.8-0.6 4.2-0.3 5.8 0.7 0.1 0.1 0.1 0.4 0 0.5zm-0.7 1.5c-0.1 0.1-0.3 0.2-0.5 0.1-1.2-0.7-2.6-0.9-4.3-0.5-0.2 0-0.3-0.1-0.4-0.2-0.1-0.2 0.1-0.4 0.2-0.4 1.9-0.4 3.6-0.2 4.9 0.6 0.3 0.1 0.3 0.3 0.1 0.4z" fill="${colors.background}"/>
      <text style="fill:${colors.text};font-family:${fontFamily};font-size:22px;font-weight:600;white-space:pre;" x="${textX}" y="${textY}">
        ${sanitizeString(songName)}
      </text>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:18px;white-space:pre;" x="${textX}" y="${textY + 30}">
        by ${sanitizeString(artistName)}
      </text>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:16px;white-space:pre;font-style:italic;" x="${textX}" y="${textY + 52}">
        on ${sanitizeString(albumName)}
      </text>
      ${progressBar}
    </g>`;
  }
};
