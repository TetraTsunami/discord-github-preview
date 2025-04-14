import { fetchAppIconURL, UserProperties } from "./discord";
import { Activity } from "discord.js";
import { URItoBase64, mixColors, prettyDuration } from "./utils";

interface ColorTheme {
  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  text: string;
  secondaryText: string;
}

const darkColors: ColorTheme = {
  background: "#111214",
  secondaryBackground: "#313338",
  tertiaryBackground: "#505059",
  text: "#fff",
  secondaryText: "#d2d6d8",
};

const lightColors: ColorTheme = {
  background: "#ffffff",
  secondaryBackground: "#f2f2f3",
  tertiaryBackground: "#e6e6e8",
  text: "#000000",
  secondaryText: "#606069",
};

const statusColors = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  offline: "#747f8d"
};

const fontFamily = "Calibri,Tahoma,Segoe UI,sans-serif";
const bannerHeight = 180;
const userHeaderHeight = 180;

function sanitizeString(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function timestampSVG(x: number, y: number, colors: ColorTheme, timeStart: number = 0, timeEnd: number = 0, progressBar = false) {
  const controllerPath = `<path transform='translate(${x} ${y + 14}) scale(${25 / 32})' fill="${statusColors.online}" fill-rule="evenodd" d="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1 17.91V13c0-3.38.46-5.85.75-7.1.15-.6.49-1.13 1.04-1.4a.47.47 0 0 0 .24-.44c0-.7.48-1.32 1.2-1.47l2.93-.62c.5-.1 1 .06 1.36.4.35.34.78.71 1.28.68a42.4 42.4 0 0 1 4.4 0c.5.03.93-.34 1.28-.69.35-.33.86-.5 1.36-.39l2.94.62c.7.15 1.19.78 1.19 1.47ZM20 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 7a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2H7v1a1 1 0 1 1-2 0v-1H4a1 1 0 1 1 0-2h1V7Z" clip-rule="evenodd" class=""></path>`
  // 4 flavors: nothing (don't show), start only (icon + "hh:mm"), end only (icon + "hh:mm left"), both (icon + "hh:mm elapsed - hh:mm left")
  const timeElapsed = timeStart ? prettyDuration(Date.now() - timeStart) : "";
  const timeRemaining = timeEnd ? prettyDuration(timeEnd - Date.now()) : "";
  if (!timeStart && !timeEnd) return "";
  let timeString = "";
  if (timeStart && timeEnd) {
    timeString = `${timeElapsed} - ${timeRemaining} left`;
  } else if (timeStart) {
    timeString = timeElapsed;
  } else {
    timeString = `${timeRemaining} left`;
  }
  if (!progressBar || (progressBar && !timeEnd)) {
    return `<g>
      ${controllerPath}
      <text style="fill: ${statusColors.online}; font-family:${fontFamily}; font-size: 20px;font-weight:600;" x="${x + 25}" y="${y + 30}">
        ${timeString}
      </text>
    </g>`
  }
  // Progress bar
  const totalActivityLength = prettyDuration(timeEnd - timeStart);
  const progress = Math.min((Date.now() - timeStart) / (timeEnd - timeStart), 1);
  const barWidth = 700 - x - 140;
  return `<g>
    <text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 20px;" x="${x}" y="${y + 30}">
      ${Date.now() > timeEnd ? totalActivityLength : timeElapsed}
    </text>
    <rect x="${x + 50}" y="${y + 22}" width="${barWidth}" height="6" rx="3" style="fill:${colors.tertiaryBackground};"/>
    <rect x="${x + 50}" y="${y + 22}" width="${barWidth * progress}" height="6" rx="3" style="fill:${colors.text};"/>
    <text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 20px;" x="${x + barWidth + 60}" y="${y + 30}">
      ${totalActivityLength}
    </text>
  </g>`
}

function cardBackground(colors: ColorTheme, nitro: boolean, totalHeight: number, banner: string | null, user: UserProperties) {
  const bgColor = colors.background;
  if (nitro) {
    return `<g>
<rect x="0" y="0" width="700" height="${totalHeight}" rx="35px" style="fill:url(#nitroGradient);"/>
<g clip-path="url(#innerBackground)">
  <rect x="5" y="5" width="690" height="${totalHeight - 10}" style="fill:url(#nitroOverlay);" />
  <g>
    <mask id="banner">
      <rect x="0" y="0" width="700" height="${bannerHeight}" fill="white"/>
      <circle cx="100" cy="${bannerHeight}" r="93" fill="black"/>
    </mask>
    <g mask="url(#banner)">
      <rect x="5" y="5" width="690" height="${bannerHeight - 5}" style="fill:${banner ? colors.secondaryBackground : user.accentColor || bgColor};" />
      ${banner ? `<image x="5" y="5" xlink:href="${banner}" height="${bannerHeight - 5}" width="690" preserveAspectRatio="xMidYMid slice" />` : ''}
    </g>
  </g>
</g>
</g>
`
  } else {
    return `<g>
<rect x="0" y="0" width="700" height="${totalHeight}" rx="35px" style="fill:${bgColor};"/>
<g clip-path="url(#background)">
  <g>
    <mask id="banner">
      <rect x="0" y="0" width="700" height="${bannerHeight}" fill="white"/>
      <circle cx="100" cy="${bannerHeight}" r="93" fill="black"/>
    </mask>
    <g mask="url(#banner)">
      <rect x="0" y="0" width="700" height="${bannerHeight}" style="fill:${banner ? colors.secondaryBackground : user.accentColor || bgColor};"/>
      ${banner ? `<image xlink:href="${banner}" height="${bannerHeight}" width="700" preserveAspectRatio="xMidYMid slice" />` : ''}
    </g>
  </g>
</g>
</g>
`
  }
}

interface ActivityDisplay {
  height: number;
  matches: (activity: Activity) => boolean;
  render: (activity: Activity, colors: ColorTheme, y: number) => Promise<string>;
}

const customStatus: ActivityDisplay = {
  height: 0,
  matches: (activity: Activity) => activity.type === 4,
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    const hasEmoji = activity.emoji !== null;
    const hasText = activity.state !== null;
    const xOffset = 220 + (hasEmoji ? 50 : 0);
    const hasCustomEmoji = activity.emoji !== null && activity.emoji.id !== null;
    const emojiSize = hasEmoji && !hasText ? 66 : 34;
    const emojiUrl = hasCustomEmoji && activity.emoji?.imageURL({ size: 64 })
    const emojiName = activity.emoji?.name;

    return `<g>
      <circle cx="220" cy="${bannerHeight - 30}" r="15" style="fill:${colors.secondaryBackground};"/>
      <circle cx="250" cy="${bannerHeight + 5}" r="25" style="fill:${colors.secondaryBackground};"/>
      <rect x="200" y="${bannerHeight + 5}" width="${hasEmoji && !hasText ? 120 : 480}" height="90" rx="25px" style="fill:${colors.secondaryBackground};"/>
    ${hasCustomEmoji ?
        `<image xlink:href="${await URItoBase64(emojiUrl as string)}" x="220" y="${bannerHeight + 15}" height="${emojiSize}" width="${emojiSize}" />` :
        hasEmoji ?
          `<text style="fill: ${colors.text}; font-family:${fontFamily}; font-size:${emojiSize - 4}px;" x="220" y="${bannerHeight + emojiSize}">${emojiName}</text>`
          : ""}
    ${hasText ? `<foreignObject x="${xOffset}" y="${bannerHeight + 25}" width="${700 - xOffset - 40}" height="60">
      <p xmlns="http://www.w3.org/1999/xhtml" 
      style="color: ${colors.secondaryText}; margin: 0; font-family:${fontFamily}; font-size: 22px; font-style: italic; line-height: 1.2em;">
      ${activity.state}</p>
    </foreignObject>` : ""}
  </g>`;
  }
}

const richPresence: ActivityDisplay = {
  height: 140,
  matches: (activity: Activity) => !!(activity.details || activity.state || activity.assets),
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    // Get image URLs, then convert them to base64. URLs are stored separately to check that they exist before converting
    const largeImageURL = activity.assets?.largeImageURL({ size: 128, extension: "webp" });
    const smallImageURL = activity.assets?.smallImageURL({ size: 32, extension: "webp" });
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
    const smallCenter = [140, 115]
    // Final SVG bits
    return `<g>
      <rect x="20" y="${y}" width="660" height="140" rx="15" style="fill:${colors.secondaryBackground};"/>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:24px;font-weight:600;" x="${textX}" y="${textY}">${sanitizeString(activity.name)}</text>
      ${detailLines.map((line, i) =>
      `<text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 20px;" x="${textX}" y="${textY + 30 + (i * 30)}">${sanitizeString(line || "")}</text>`).join("")
      }
      ${timestamps ? timestampSVG(textX, textY + (detailLines.length * 30), colors, timestamps.start?.getTime(), timestamps.end?.getTime(), true) : ""}
      ${largeImage ?
        `<image xlink:href="${await largeImage}" x="30" y="${y + 10}" height="120" width="120" clip-path="inset(0% round 5px)" />`
        : ""}
      ${smallImage &&
        `<rect x="${smallCenter[0]-22}" y="${y + smallCenter[1]-22}" width="44" height="44" rx="100%" style="fill:${colors.secondaryBackground};"/>
        <image xlink:href="${await smallImage}" x="${smallCenter[0]-19}" y="${y+smallCenter[1]-19}" height="38" width="38" clip-path="circle()" />`
      || ""}
    </g>`;
  }
}

const genericActivity: ActivityDisplay = {
  height: 140,
  matches: () => true,
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    // placeholder is "naturally" a size around 512x512 so we scale it down to be 120 pixels tall
    const placeholderPath = `<path transform='translate(30 ${y + 10}) scale(${120 / 512})' fill="${colors.text}" d="M384 32H64C28.654 32 0 60.654 0 96V416C0 451.346 28.654 480 64 480H384C419.346 480 448 451.346 448 416V96C448 60.654 419.346 32 384 32ZM224 400C206 400 192 386 192 368S206 336 224 336C242 336 256 350 256 368S242 400 224 400ZM294 258L248 286V288C248 301 237 312 224 312S200 301 200 288V272C200 264 204 256 212 251L269 217C276 213 280 206 280 198C280 186 270 176 258 176H206C194 176 184 186 184 198C184 211 173 222 160 222S136 211 136 198C136 159 167 128 206 128H258C297 128 328 159 328 198C328 222 315 245 294 258Z"/>`
    const iconURL = activity.applicationId ? await fetchAppIconURL(activity.applicationId) : null;
    const textY = y + 30;
    const textX = 170;
    return `<g>
      <rect x="20" y="${y}" width="660" height="140" rx="15" style="fill:${colors.secondaryBackground};"/>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:24px;font-weight:600;" x="${textX}" y="${textY}">${activity.name}</text>
      ${iconURL ?
        `<image xlink:href="${await URItoBase64(iconURL)}" x="30" y="${y + 10}" height="120" width="120" clip-path="inset(0% round 5px)" />`
        : placeholderPath}
      ${timestampSVG(textX, textY, colors, activity.timestamps?.start?.getTime())}
    </g>`;
  }
}

// Spotify-specific activity handler with album art and progress bar
const spotifyActivity: ActivityDisplay = {
  height: 140,
  matches: (activity: Activity) => activity.name === "Spotify",
  render: async function (activity: Activity, colors: ColorTheme, y: number): Promise<string> {
    // Get album art
    const albumArtURL = activity.assets?.largeImageURL({ size: 256, extension: "webp" });
    const albumArt = albumArtURL && URItoBase64(albumArtURL);
    
    // Extract song details
    const songName = activity.details || "Unknown Song";
    const artistName = activity.state || "Unknown Artist";
    const albumName = activity.assets?.largeText || "Unknown Album";
    
    // Truncate long text
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };
    
    const truncatedSongName = truncateText(songName, 25);
    const truncatedArtistName = truncateText(artistName, 30);
    const truncatedAlbumName = truncateText(albumName, 35);
    
    // Spotify colors
    const spotifyGreen = "#1DB954";
    
    // Create a unique ID for this instance to avoid SVG ID conflicts
    const uniqueId = `spotify-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
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
      
      // Format mm:ss
      const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      };
      
      const currentPosition = formatTime(currentTime - startTime);
      const totalDuration = formatTime(endTime - startTime);
      
      duration = `${currentPosition} / ${totalDuration}`;
      
      // Create progress bar
      progressBar = `
        <rect x="${textX}" y="${textY + 65}" width="460" height="4" rx="2" style="fill:${colors.tertiaryBackground};"/>
        <rect x="${textX}" y="${textY + 65}" width="${Math.max(460 * progress, 4)}" height="4" rx="2" style="fill:${spotifyGreen};"/>
        <text style="fill: ${colors.secondaryText}; font-family:${fontFamily}; font-size: 14px;" x="${textX}" y="${textY + 90}">${duration}</text>
      `;
    }
    
    return `<g>
      <rect x="20" y="${y}" width="660" height="140" rx="15" style="fill:${colors.secondaryBackground};"/>
      
      <!-- Album Art with Rounded Corners -->
      ${albumArt ? 
        `<clipPath id="albumArtClip-${uniqueId}">
           <rect x="30" y="${y + 10}" width="120" height="120" rx="6"/>
         </clipPath>
         <g clip-path="url(#albumArtClip-${uniqueId})">
           <image xlink:href="${await albumArt}" x="30" y="${y + 10}" height="120" width="120" />
         </g>` : 
        `<rect x="30" y="${y + 10}" width="120" height="120" rx="6" style="fill:#333333;"/>`
      }
      
      <!-- Spotify Logo -->
      <circle cx="42" cy="${y + 122}" r="12" fill="#000000"/>
      <path d="M44.9 ${y + 118.4}c-1.6-1-4.3-1.1-5.8-0.6-0.3 0.1-0.5-0.1-0.6-0.3-0.1-0.3 0.1-0.5 0.3-0.6 1.8-0.5 4.7-0.4 6.6 0.7 0.2 0.1 0.3 0.4 0.2 0.6-0.1 0.2-0.4 0.3-0.7 0.2zm-0.3 1.5c-0.1 0.2-0.4 0.3-0.6 0.1-1.3-0.8-3.4-1.1-4.9-0.6-0.2 0-0.5 0-0.5-0.2-0.1-0.2 0-0.5 0.2-0.5 1.8-0.6 4.2-0.3 5.8 0.7 0.1 0.1 0.1 0.4 0 0.5zm-0.7 1.5c-0.1 0.1-0.3 0.2-0.5 0.1-1.2-0.7-2.6-0.9-4.3-0.5-0.2 0-0.3-0.1-0.4-0.2-0.1-0.2 0.1-0.4 0.2-0.4 1.9-0.4 3.6-0.2 4.9 0.6 0.3 0.1 0.3 0.3 0.1 0.4z" fill="${spotifyGreen}"/>
      
      <!-- Song Information -->
      <text style="fill:${colors.text};font-family:${fontFamily};font-size:22px;font-weight:600;white-space:pre;" x="${textX}" y="${textY}">
        ${sanitizeString(truncatedSongName)}
      </text>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:18px;white-space:pre;" x="${textX}" y="${textY + 30}">
        by ${sanitizeString(truncatedArtistName)}
      </text>
      <text style="fill:${colors.secondaryText};font-family:${fontFamily};font-size:16px;white-space:pre;font-style:italic;" x="${textX}" y="${textY + 52}">
        on ${sanitizeString(truncatedAlbumName)}
      </text>
      
      <!-- Progress Bar -->
      ${progressBar}
    </g>`;
  }
}

const displayables = [customStatus, spotifyActivity, richPresence, genericActivity];

// Helper function to generate about me section
function generateAboutMeSVG(aboutMe: string, colors: ColorTheme, startY: number): string {
  if (!aboutMe) return '';
  
  // Sanitize the text
  const sanitizedText = sanitizeString(aboutMe);
  // Estimate height based on text length (rough calculation)
  const estimatedHeight = Math.max(140, 100 + Math.ceil(sanitizedText.length / 40) * 24);
  
  return `
  <g>
    <rect x="20" y="${startY}" width="660" height="${estimatedHeight}" rx="15" style="fill:${colors.secondaryBackground};"/>
    <text style="fill:${colors.text};font-family:${fontFamily};font-size:24px;font-weight:600;" x="40" y="${startY + 40}">About Me</text>
    <foreignObject x="40" y="${startY + 60}" width="620" height="${estimatedHeight - 70}">
      <div xmlns="http://www.w3.org/1999/xhtml" 
      style="color: ${colors.secondaryText}; margin: 0; font-family:${fontFamily}; font-size: 18px; line-height: 1.4em; word-wrap: break-word; white-space: pre-wrap; overflow: hidden;">
      ${sanitizedText}</div>
    </foreignObject>
  </g>`;
}

export interface CardOptions {
  overrideBannerUrl: string | null;
  aboutMe: string | null;
  hideDecoration: boolean;
  themeType: "dark" | "light" | "custom" | "nitroDark" | "nitroLight";
  nitroColor1: string;
  nitroColor2: string;
  customColors?: ColorTheme;
}

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
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const display = displayables.find(displayable => displayable.matches(activity)) as ActivityDisplay;
    activityPromises.push(display.render(activity, colors, currentHeight));
    currentHeight += display.height;
    if (i != activities.length - 1 && display.height) {
      currentHeight += 10; // padding between activities
    }
  }
  // Add additional spacing after activities if any exist
  if (activities.length > 0) {
    currentHeight += 20;
  }
  // Store section positions for later use
  let aboutMeHeight;
  let aboutMeY = currentHeight;
  // Estimate About Me section height if present
  if (options.aboutMe) {
    const estimatedHeight = Math.max(140, 100 + Math.ceil((options.aboutMe.length || 0) / 40) * 24);
    aboutMeHeight = estimatedHeight;
    currentHeight += estimatedHeight + 20; // Add padding after section
  }
  const totalHeight = currentHeight + 20; // Add padding at the botto
  // Await all at once for images to load
  const [avatar, banner, decoration, awaitedActivities] = await Promise.all([
    user.avatarURL, 
    user.bannerURL, 
    user.avatarDecorationURL,
    Promise.all(activityPromises)
  ]);
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 700 ${totalHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
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
${options.aboutMe ? generateAboutMeSVG(options.aboutMe, colors, aboutMeY) : ""}
</svg>`.replace(/\n\s+/g, "");
}