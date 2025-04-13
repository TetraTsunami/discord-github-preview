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
  const avatarURL = member.displayAvatarURL({ size: 128, extension: "webp" }) || member.user.defaultAvatarURL
  const avatarDecorationData = member.user.avatarDecoration;
  const isDecorationAnimated = avatarDecorationData?.includes('a_') || false;
  const avatarDecorationURL = member.user.avatarDecorationURL({ 
    size: 512, 
    extension: isDecorationAnimated ? "gif" : "webp" 
  });
  const bannerURL = member.user.bannerURL({ size: 512, extension: "webp" });
  
  // Fetch additional user profile data
  let aboutMe = null;
  let nitroProfileColor = null;
  
  try {
    // Use Discord API to get user data
    const userResponse = await fetch(`https://discord.com/api/v10/users/${userID}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      
      // Get the about me/bio from user data
      aboutMe = userData.bio || null;
      
      // Get profile accent color if available
      if (userData.accent_color) {
        // Convert decimal color to hex
        nitroProfileColor = `#${userData.accent_color.toString(16).padStart(6, '0')}`;
      } else if (userData.banner_color) {
        nitroProfileColor = userData.banner_color;
      }
      
      // Try to get profile data if needed
      try {
        const profileResponse = await fetch(`https://discord.com/api/v10/users/${userID}/profile`, {
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          // Use bio from profile data if we didn't get it from user data
          if (!aboutMe && profileData.user?.bio) {
            aboutMe = profileData.user.bio;
          }
          
          // Try to get Nitro profile color if we didn't already get it
          if (!nitroProfileColor && (profileData.user?.banner_color || profileData.premium_guild_since)) {
            nitroProfileColor = profileData.user?.banner_color || member.user.hexAccentColor;
          }
        }
      } catch (profileError) {
        // Failed to get profile data, continue with what we have
      }
    }
  } catch (error) {
    // Failed to get user data, continue with what we have
  }

  const userProperties: UserProperties = {
    username: member.user.username,
    displayName: member.nickname || member.user.displayName,
    id: member.id,
    avatarURL: avatarURL ? URItoBase64(avatarURL) : Promise.resolve(""),
    avatarDecorationURL: avatarDecorationURL ? URItoBase64(avatarDecorationURL) : null,
    isDecorationAnimated,
    bannerURL: bannerURL ? URItoBase64(bannerURL) : null,
    accentColor: member.user.hexAccentColor || null,
    nitroProfileColor,
    aboutMe,
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