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
  presence: Presence | null;
}

export const validateId = (id: string) => {
  return id.match(/^[0-9]{17,19}$/);
}

export function roundImageSize(size: number): 64 | 128 | 256 | 512 | 1024 {
  const allowedSizes = [64, 128, 256, 512, 1024, 2048];
  for (const s of allowedSizes) {
    if (size <= s) return s as 64 | 128 | 256 | 512 | 1024;
  }
  return 1024;
}

// discord.js doesn't support building non-default (animated and normal size) avatar decoration URLs
function getAvatarDecorationURL(client: Client<true>, asset: string, size: number, animated: boolean = true): string {
  const out = new URL(`https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`);
  if (size && !animated) {
    out.searchParams.set("size", size.toString());
    out.searchParams.set("passthrough", "false");
  }
  return out.toString();
}

// Fetches user info. Uses animation/width values to determine which images to use for avatar, decoration, and banner.
export async function fetchUserInfo(client: Client<true>, userID: string, animated = false, width = 500): Promise<UserProperties | null> {
  const guildID = process.env.DISCORD_GUILD_ID as string;
  const member = await client.guilds.cache.get(guildID)?.members.fetch({ user: userID, force: true });
  if (!member) {
    return null;
  }
  const avatarURL = member.displayAvatarURL({ size: roundImageSize(width / 4), extension: "webp", forceStatic: !animated }) || member.user.defaultAvatarURL
  const avatarDecorationAsset = member.user.avatarDecorationData?.asset || null;
  const isDecorationAnimated = (animated && avatarDecorationAsset?.includes('a_')) || false;
  const avatarDecorationURL = member.user.avatarDecorationData ? getAvatarDecorationURL(client, member.user.avatarDecorationData.asset, roundImageSize(width / 4), animated) : null;
  const bannerURL = member.user.bannerURL({ size: roundImageSize(width), extension: "webp", forceStatic: !animated }) || null;
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
