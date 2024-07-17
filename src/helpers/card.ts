import { UserProperties } from "@/helpers/discord";
import { Activity } from "discord.js";

const colors = {
  background: "#313338",
  text: "#fff",
  lightText: "#72767d"
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

const customStatus = (activity: CustomStatus, y: Number) => {
  const emojiUrl = activity.emoji?.url;
}

export const makeCard = (user: UserProperties) => {
  const statusString = ((user.presence?.status && statusColors.hasOwnProperty(user.presence.status)) ? user.presence.status : "online") as keyof typeof statusColors;
  /* Activity types:
  1. Custom status (with custom emojis?)
  2. Current activity (game, can be up to 4 lines I think)
  */
 /*
 activities: [
    Activity {
      name: 'Custom Status',
      type: 4,
      url: null,
      details: null,
      state: 'they might be goats',
      applicationId: null,
      timestamps: [Object],
      party: null,
      syncId: null,
      assets: null,
      flags: [ActivityFlagsBitField],
      emoji: null,
      emoji: Emoji { animated: null, name: '🐐', id: null },
      emoji: Emoji { animated: false, name: 'goated', id: '901527894315139082' }.imageUrl({size: 128}),
      buttons: [],
      createdTimestamp: 1721251487348
    }
  */
//  console.log(user.presence?.activities);
 const activities = user.presence?.activities;
 const height = 210 + (activities?.length || 0) * 60;

  
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 700 ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">

<!-- Banner & card background -->
<g>
  <rect x="0" y="0" width="700" height="${height}" rx="10" style="fill:${colors.background};"/>
  <clipPath id="background">
    <rect x="0" y="0" width="700" height="${height}" rx="10" />
  </clipPath>
  <g clip-path="url(#background)">
    <g>
      <rect x="0" y="0" width="700" height="112.5" style="fill:${user.accentColor};"/>
      <clipPath id="banner">
        <rect x="0" y="0" width="700" height="112.5"/>
      </clipPath>
      <g clip-path="url(#banner)">
        <image xlink:href="${user.bannerURL}" height="112.5" width="700" preserveAspectRatio="xMidYMid slice" />
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
    <image xlink:href="${user.avatarURL}" x="17" y="32" height="166" width="166" />
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
<text style="fill: ${colors.lightText}; font-family:Tahoma,Verdana,sans-serif; font-size: 22px; white-space: pre;" x="208" y="190">${user.username}</text>
</svg>`, 'binary');
}