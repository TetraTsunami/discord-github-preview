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

export async function fetchUserInfo(client: Client<true>, id: string) {
  const guildID = process.env.DISCORD_GUILD_ID as string;
  const member = await client.guilds.cache.get(guildID)?.members.fetch({ user: id, force: true });
  if (!member) {
    return null;
  }
  const userProperties: UserProperties = {
    username: member.user.username,
    displayName: member.nickname || member.user.displayName,
    id: member.id,
    avatarURL: member.displayAvatarURL(),
    avatarDecorationURL: member.user.avatarDecorationURL(),
    bannerURL: member.user.bannerURL(),
    accentColor: member.user.hexAccentColor,
    presence: member.presence,
  }
  return userProperties;
}