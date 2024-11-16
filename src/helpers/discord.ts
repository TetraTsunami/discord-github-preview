import { Client, Presence } from "discord.js";
import { pngURLtoBase64, jpgURLtoBase64 } from "./utils";

export interface UserProperties {
  username: string;
  displayName: string;
  id: string;
  avatarURL: Promise<string>;
  avatarDecorationURL: Promise<string> | null;
  bannerURL: Promise<string> | null;
  accentColor: string | null;
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
  const avatarURL = member.displayAvatarURL({ size: 128, extension: "webp" }) || member.user.defaultAvatarURL
  const avatarDecorationURL = member.user.avatarDecorationURL({ size: 512, extension: "webp" });
  const bannerURL = member.user.bannerURL({ size: 512, extension: "webp" });

  const userProperties: UserProperties = {
    username: member.user.username,
    displayName: member.nickname || member.user.displayName,
    id: member.id,
    avatarURL: pngURLtoBase64(avatarURL), // TODO: animated avatars, decorations and banners?
    avatarDecorationURL: avatarDecorationURL ? pngURLtoBase64(avatarDecorationURL) : null,
    bannerURL: bannerURL ? jpgURLtoBase64(bannerURL) : null,
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
  if (!appRPC) {
    return null;
  }
  return `https://cdn.discordapp.com/app-icons/${appID}/${appRPC.icon}.webp`;
}