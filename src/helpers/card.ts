import { fetchAppIconURL, UserProperties } from "./discord";
import { Activity } from "discord.js";
import { mediaURLtoBase64, prettyDuration } from "./utils";

const colors = {
  background: "#313338",
  text: "#fff",
  secondaryText: "#b9bbbe",
  tertiaryText: "#72767d"
};
const statusColors = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  offline: "#747f8d"
}

interface CustomStatus extends Activity {
  type: 4;
}

const isCustomStatus = (activity: Activity): activity is CustomStatus => {
  return activity.type === 4;
}

const customStatusSVG = async (activity: CustomStatus, y: number): Promise<string> => {
  const hasEmoji = activity.emoji !== null;
  const xOffset = hasEmoji ? 60 : 20;
  const hasCustomEmoji = activity.emoji !== null && activity.emoji.id !== null;
  const emojiUrl = hasCustomEmoji && activity.emoji?.imageURL({size: 64})
  const emojiName = activity.emoji?.name;

  return `<g>
  <rect x="200" y="${y}" width="500" height="60" style="fill:${colors.background};"/>
  ${hasCustomEmoji ? 
    `<image xlink:href="${await mediaURLtoBase64(emojiUrl as string)}" x="20" y="${y + 2}" height="34" width="34" />` :
  hasEmoji ?
    `<text style="fill: ${colors.text}; font-family:Tahoma,Verdana,sans-serif; font-size: 30px;" x="20" y="${y + 30}">${emojiName}</text>`
  : ""}
  <foreignObject x="${xOffset}" y="${y + 6}" width="630" height="60">
    <p xmlns="http://www.w3.org/1999/xhtml" 
    style="color: ${colors.secondaryText}; margin: 0; font-family:Tahoma,Verdana,sans-serif; font-size: 22px; font-style: italic; line-height: 1.2em;">
    ${activity.state}</p>
  </foreignObject>
</g>`;
}

const isRichPresence = (activity: Activity) => {
  return !!(activity.details || activity.state || activity.assets);
}

// All other activities ought to be parsable as a generic activity with space for Rich Presence assets
const activitySVG = (activity: Activity, y: number): Promise<string> => {
  try {
    if (isRichPresence(activity)) {
      return richPresenceSVG(activity, y);
    } else {
      return genericActivitySVG(activity, y);
    }
  } catch (e) {
    console.error(e);
    return Promise.resolve("");
  }
}

const richPresenceSVG = async (activity: Activity, y: number): Promise<string> => {
  // Get image URLs, then convert them to base64. URLs are stored separately to check that they exist before converting
  const largeImageURL = activity.assets?.largeImageURL({ size: 128, extension: "webp" });
  const smallImageURL = activity.assets?.smallImageURL({ size: 32, extension: "webp" });
  const largeImage = largeImageURL && mediaURLtoBase64(largeImageURL);
  const smallImage = smallImageURL && mediaURLtoBase64(smallImageURL);
  const timestamps = activity.timestamps;
  // 4 flavors: nothing (don't show), start only (hh:mm elapsed), end only (hh:mm remaining), both (hh:mm elapsed - hh:mm remaining)
  const timeElapsed = timestamps?.start ? prettyDuration(Date.now() - timestamps.start.getTime()) : "";
  const timeRemaining = timestamps?.end ? prettyDuration(timestamps.end.getTime() - Date.now()) : "";
  const timeString = timeElapsed && timeRemaining ? 
    `${timeElapsed} elapsed - ${timeRemaining} remaining` :
    timeElapsed ? `${timeElapsed} elapsed` :
    timeRemaining ? `${timeRemaining} remaining` : "";
  const detailLines = [activity.details, activity.state, timeString].filter(Boolean);
  const textY = largeImage ? y + 40 : y + 35;
  const textX = largeImage ? 208 : 128;
  // Final SVG bits
  return `<g>
    <rect x="200" y="${y}" width="500" height="60" style="fill:${colors.background};"/>
    <text style="fill: ${colors.secondaryText}; font-family:Tahoma,Verdana,sans-serif; font-size: 30px;" x="${textX}" y="${textY}">${activity.name}</text>
    ${detailLines.map((line, i) => `<text style="fill: ${colors.tertiaryText}; font-family:Tahoma,Verdana,sans-serif; font-size: 20px;" x="${textX}" y="${textY + 36 + (i * 30)}">${line}</text>`).join("")}
    ${largeImage ? `<image xlink:href="${await largeImage}" x="24" y="${y}" height="160" width="160" clip-path="inset(0% round 15px)" />` : ""}
    ${smallImage && `<rect x="131" y="${y + 107}" width="58" height="58" rx="17px" ry="17px" style="fill:${colors.background};"/>
      <image xlink:href="${await smallImage}" x="135" y="${y + 111}" height="50" width="50" clip-path="inset(0% round 15px)" />` || ""}
  </g>`;
}

const genericActivitySVG = async (activity: Activity, y: number): Promise<string> => {
  const placeholderImg = `<path transform='translate(24 ${y}) scale(0.234375)' fill="${colors.text}" d="M384 32H64C28.654 32 0 60.654 0 96V416C0 451.346 28.654 480 64 480H384C419.346 480 448 451.346 448 416V96C448 60.654 419.346 32 384 32ZM224 400C206 400 192 386 192 368S206 336 224 336C242 336 256 350 256 368S242 400 224 400ZM294 258L248 286V288C248 301 237 312 224 312S200 301 200 288V272C200 264 204 256 212 251L269 217C276 213 280 206 280 198C280 186 270 176 258 176H206C194 176 184 186 184 198C184 211 173 222 160 222S136 211 136 198C136 159 167 128 206 128H258C297 128 328 159 328 198C328 222 315 245 294 258Z"/>`
  const iconURL = activity.applicationId ? await fetchAppIconURL(activity.applicationId) : null;
  const embedIcon = iconURL ? `<image xlink:href="${await mediaURLtoBase64(iconURL)}" x="24" y="${y}" height="120" width="120" clip-path="inset(0% round 15px)" />` : placeholderImg;
  const timeString = activity.timestamps?.start ? prettyDuration(Date.now() - activity.timestamps.start.getTime()) + " elapsed": "";
  return `<g>
    <text style="fill: ${colors.secondaryText}; font-family:Tahoma,Verdana,sans-serif; font-size: 30px;" x="164" y="${y + 35}">${activity.name}</text>
    ${embedIcon}
    <text style="fill: ${colors.tertiaryText}; font-family:Tahoma,Verdana,sans-serif; font-size: 20px;" x="164" y="${y + 66}">${timeString}</text>
  </g>`;
}

export const makeCard = async (user: UserProperties) => {
  const statusString = ((user.presence?.status && statusColors.hasOwnProperty(user.presence.status)) ? user.presence.status : "online") as keyof typeof statusColors;
  /* Activity types:
  1. Custom status (with custom emojis?)
  2. Current activity (game, can be up to 4 lines I think)
  */
  const activities = user.presence?.activities || [];
  // Height = 210 (user info, banner) + the height of all the activities, which varies based on the type of activity
  const userHeight = 220;
  const activityHeights = activities?.map(activity => isCustomStatus(activity) ? 80 : 
                                        isRichPresence(activity) ? 170 :
                                        130 ) || [];
  const totalHeight = userHeight + (activityHeights.reduce((acc, curr) => acc + curr, 0)) + 10; // 10px padding at the bottom
  // Generate promises all at once so they can be awaited in parallel (activities need promises for their images)
  const activityPromises: Promise<string>[] = []
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const y = userHeight + (activityHeights.slice(0, i).reduce((acc, curr) => acc + curr, 0));
    activityPromises.push(isCustomStatus(activity) ? customStatusSVG(activity, y) : activitySVG(activity, y));
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 700 ${totalHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">

<!-- Banner & card background -->
<g>
  <rect x="0" y="0" width="700" height="${totalHeight}" rx="10" style="fill:${colors.background};"/>
  <clipPath id="background">
    <rect x="0" y="0" width="700" height="${totalHeight}" rx="10" />
  </clipPath>
  <g clip-path="url(#background)">
    <g>
      <rect x="0" y="0" width="700" height="112.5" style="fill:${user.accentColor};"/>
      <clipPath id="banner">
        <rect x="0" y="0" width="700" height="112.5"/>
      </clipPath>
      <g clip-path="url(#banner)">
        ${user.bannerURL &&
          `<image xlink:href="${await user.bannerURL}" height="112.5" width="700" preserveAspectRatio="xMidYMid slice" />`
        }
      </g>
    </g>
  </g>
</g>

<!-- Avatar -->
<g>
  <circle cx="100" cy="115" r="93" style="fill:${colors.background};"/>
  <clipPath id="avatar">
    <circle cx="100" cy="115" r="83"/>
  </clipPath>
  <g clip-path="url(#avatar)">
    <image xlink:href="${await user.avatarURL}" x="17" y="32" height="166" width="166" />
  </g>
</g>

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
  <circle cx="160" cy="165" r="30" style="fill:${colors.background};"/>
  <rect x="140" y="145" width="40" height="40" style="fill:${statusColors[statusString]}; mask:url('#status-${statusString}');"/>
</g>

<!-- Display Name -->
<text style="fill: ${colors.text}; font-family:Tahoma,Verdana,sans-serif; font-size: 44px; font-weight: 700; white-space: pre;" x="208" y="165">${user.displayName}</text>
<text style="fill: ${colors.tertiaryText}; font-family:Tahoma,Verdana,sans-serif; font-size: 22px; white-space: pre;" x="208" y="190">${user.username}</text>

<!-- Discord Icon -->
<path fill="${colors.text}" transform='translate(650 10) scale(0.3)' d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>

<!-- Activities, if any -->
${await Promise.all(activityPromises).then(promises => promises.join("\n"))}
</svg>`;
}