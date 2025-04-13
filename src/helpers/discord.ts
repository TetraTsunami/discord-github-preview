import { Client, Presence } from "discord.js";
import { URItoBase64 } from "./utils";

export interface UserProperties {
  username: string;
  displayName: string;
  id: string;
  avatarURL: Promise<string | null>;
  avatarDecorationURL: Promise<string | null> | null;
  isDecorationAnimated: boolean;
  bannerURL: Promise<string | null> | null;
  accentColor: string | null;
  nitroProfileColor: string | null;
  aboutMe: string | null;
  presence: Presence | null;
}

export const validateId = (id: string) => {
  return id.match(/^[0-9]{17,19}$/);
}

export async function fetchUserInfo(client: Client<true>, userID: string) {
  const guildID = process.env.DISCORD_GUILD_ID as string;
  const member = await client.guilds.cache.get(guildID)?.members.fetch({ user: userID, force: true });
  if (!member) {
    return null;
  }
  const avatarURL = member.displayAvatarURL({ size: 256, extension: "webp" }) || member.user.defaultAvatarURL
  const avatarDecorationAsset = member.user.avatarDecorationData?.asset || null;
  const isDecorationAnimated = avatarDecorationAsset?.includes('a_') || false;
  const avatarDecorationURL = member.user.avatarDecorationURL({ 
    size: 256, 
    extension: isDecorationAnimated ? "gif" : "webp" 
  });
  const bannerURL = member.user.bannerURL({ size: 512, extension: "webp" });
  // unfortunately, bots are not allowed to fetch the profile endpoint, which contains the nitro profile color and bio
  const userProperties: UserProperties = {
    username: member.user.username,
    displayName: member.nickname || member.user.displayName,
    id: member.id,
    avatarURL: avatarURL ? URItoBase64(avatarURL) : Promise.resolve(""),
    avatarDecorationURL: avatarDecorationURL ? URItoBase64(avatarDecorationURL) : null,
    isDecorationAnimated,
    bannerURL: bannerURL ? URItoBase64(bannerURL) : null,
    accentColor: member.user.hexAccentColor || null,
    nitroProfileColor: null,
    aboutMe: null,
    presence: member.presence,
  }
  return userProperties;
}

export async function fetchAppIconURL(appID: string) {
  const appRPC = await fetch(`https://discord.com/api/v10/applications/${appID}/rpc`).then((res) => {
    if (!res.ok) {
      return null;
    }
    return res.json();
  })
  // The Xbox console connection doesn't have an icon on the backend,
  // so we'll use a local image instead.
  // This is okay because the app always converts image URLs to Base64
  if (appRPC.name === "Xbox") {
    return "./src/xboxball.png";
  }
  if (!appRPC || !appRPC.icon) {
    return null;
  }
  return `https://cdn.discordapp.com/app-icons/${appID}/${appRPC.icon}.webp`;
}