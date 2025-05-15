import { UserProperties } from "./discord";
import { mixColors } from "./utils";
import { darkColors, lightColors, statusColors } from "./themes";
import { ActivityDisplay, CardOptions } from "../types";
import { cardBackground } from "./svg/cardBackground";
import { spotifyActivity } from "./displayables/spotifyActivity";
import { customStatus } from "./displayables/customStatus";
import { richPresence } from "./displayables/richPresence";
import { genericActivity } from "./displayables/genericActivity";
import { aboutMe, aboutMeHeight } from "./svg/aboutMe";

export const fontFamily = "Calibri,Tahoma,Segoe UI,sans-serif";
export const bannerHeight = 180;
const userHeaderHeight = 180;

export function sanitizeString(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const displayables = [customStatus, spotifyActivity, richPresence, genericActivity];

export const makeCard = async (user: UserProperties, options: CardOptions) => {
  const statusString = ((user.presence?.status && statusColors.hasOwnProperty(user.presence.status)) ? user.presence.status : "online") as keyof typeof statusColors;
  const activities = user.presence?.activities || [];
  if (process.env.NODE_ENV === "development") {
    console.log("User", user);
    console.log("Activities", activities);
  }

  if (options.hideDecoration) {
    user.avatarDecorationURL = null;
  }
  // Handle theme color settings
  let colors = darkColors;
  if (options.themeType === "light" || options.themeType === "nitroLight") {
    colors = lightColors;
  } else if (options.themeType === "custom") {
    colors = {
      ...darkColors,
      ...options.customColors,
    }
  }
  const isNitroProfile = options.themeType === "nitroDark" || options.themeType === "nitroLight";
  // Generate promises all at once so they can be awaited in parallel (activities use promises to load their images)
  const activityPromises: Promise<string>[] = []
  let currentHeight = bannerHeight + userHeaderHeight;

  // Filter out Spotify activities if hideSpotify is true
  const filteredActivities = options.hideSpotify
    ? activities.filter(activity => activity.name !== "Spotify")
    : activities;

  for (let i = 0; i < filteredActivities.length; i++) {
    const activity = filteredActivities[i];
    const display = displayables.find(displayable => displayable.matches(activity)) as ActivityDisplay;
    activityPromises.push(display.render(activity, colors, currentHeight, options.width));
    currentHeight += display.height + 10;
  }
  // about me
  let aboutMeY = currentHeight;
  if (options.aboutMe) {
    const estimatedHeight = aboutMeHeight(sanitizeString(options.aboutMe));
    currentHeight += estimatedHeight + 10;
  }
  const totalHeight = currentHeight + 10; // padding at the bottom
  // Await all at once for images to load
  const [avatar, banner, decoration, awaitedActivities] = await Promise.all([
    user.avatarURL,
    user.bannerURL,
    user.avatarDecorationURL,
    Promise.all(activityPromises)
  ]);
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${options.width}px" height="100%" viewBox="0 0 700 ${totalHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
  <defs>
    <clipPath id="background">
      <rect x="0" y="0" width="700" height="${totalHeight}" rx="35px" />
    </clipPath>
    ${isNitroProfile && `
      <clipPath id="innerBackground">
        <rect x="5" y="5" width="690" height="${totalHeight - 10}" rx="30px" />
      </clipPath>
      <linearGradient id="nitroGradient" x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" style="stop-color:${options.nitroColor1}" />
        <stop offset="100%" style="stop-color:${options.nitroColor2}" />
      </linearGradient>
      <linearGradient id="nitroOverlay" x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" style="stop-color:${mixColors(options.nitroColor1, colors.background, 0.35)}" />
        <stop offset="100%" style="stop-color:${mixColors(options.nitroColor2, colors.background, 0.35)}" />
      </linearGradient>
    `}
  </defs>

<!-- Banner & card background -->
${cardBackground(colors, isNitroProfile, totalHeight, banner, user)}
<!-- Avatar -->
<g>
  <clipPath id="avatar">
    <circle cx="100" cy="${bannerHeight}" r="83"/>
  </clipPath>
  <g clip-path="url(#avatar)">
    <image xlink:href="${avatar}" x="17" y="${bannerHeight - 83}" height="166" width="166" />
  </g>
</g>

<!-- Avatar Decoration -->
${decoration ? `
<g>
  <image xlink:href="${decoration}" x="0" y="${bannerHeight - 100}" height="200" width="200" />
</g>
` : ''}

<!-- Status -->
<g>
  <mask id="status-online" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
  </mask>
  <mask id="status-idle" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
    <circle fill="black" cx="0.25" cy="0.25" r="0.375"></circle>
  </mask>
  <mask id="status-dnd" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
    <rect fill="black" x="0.125" y="0.375" width="0.75" height="0.25" rx="0.125" ry="0.125"></rect>
  </mask>
  <mask id="status-offline" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
    <circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle>
  </mask>
</g>

<g>
  <circle cx="160" cy="${bannerHeight + 60}" r="30" style="fill:${colors.background};"/>
  <rect x="140" y="${bannerHeight + 40}" width="40" height="40" style="fill:${statusColors[statusString]}; mask:url('#status-${statusString}');"/>
</g>

<!-- Display Name -->
<text style="fill: ${colors.text}; font-family:${fontFamily}; font-size: 44px; font-weight: 800; white-space: pre;" x="40" y="${bannerHeight + 93 + 40}">${user.displayName}</text>
<text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 22px; white-space: pre;" x="40" y="${bannerHeight + 93 + 40 + 30}">${user.username}</text>

<!-- Discord Icon -->
<path fill="#fff" transform='translate(645 15) scale(0.3)' d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>

<!-- Activities, if any -->
${awaitedActivities.join("\n")}

<!-- About Me -->
${options.aboutMe ? aboutMe(options.aboutMe, colors, aboutMeY) : ""}
</svg>`.replace(/\n\s+/g, "");
}
