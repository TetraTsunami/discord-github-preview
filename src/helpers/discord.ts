import { Client, Presence } from "discord.js";

export interface UserProperties {
  username: string;
  displayName: string;
  id: string;
  avatarURL: string;
  avatarDecorationURL: string | null;
  bannerURL: string | null | undefined;
  accentColor: string | null | undefined;
  presence: Presence | null;
}

export const validateId = (id: string) => {
  return id.match(/^[0-9]{17,19}$/);
}

const pngURLtoBase64 = async (url: string) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`);
}

const jpgURLtoBase64 = async (url: string) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`);
}

export async function fetchUserInfo(client: Client<true>, id: string) {
  const guildID = process.env.DISCORD_GUILD_ID as string;
  const member = await client.guilds.cache.get(guildID)?.members.fetch({ user: id, force: true });
  if (!member) {
    return null;
  }
  const avatarURL = member.displayAvatarURL({ size: 512, extension: "png" }) || member.user.defaultAvatarURL
  const avatarDecorationURL = member.user.avatarDecorationURL({ size: 1024, extension: "png" });
  const bannerURL = member.user.bannerURL({ size: 1024, extension: "jpg" });

  const userProperties: UserProperties = {
    username: member.user.username,
    displayName: member.nickname || member.user.displayName,
    id: member.id,
    avatarURL: await pngURLtoBase64(avatarURL), // TODO: animated avatars, decorations and banners?
    avatarDecorationURL: avatarDecorationURL && await pngURLtoBase64(avatarDecorationURL),
    bannerURL: bannerURL && await jpgURLtoBase64(bannerURL),
    accentColor: member.user.hexAccentColor,
    presence: member.presence,
  }
  return userProperties;
}