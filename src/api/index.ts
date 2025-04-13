import readyClient from "../bot";
import { makeCard } from "../helpers/card";
import { validateId, fetchUserInfo } from "../helpers/discord";
import type { RequestHandler } from "express";
import { URItoBase64 } from "../helpers/utils";

export const discordSelf: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export const discordDebug: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id || process.env.TEST_USER_ID || "214167454291722241";
  
  try {
    // Fetch the user first
    let user = await fetchUserInfo(client, id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    
    // Force add the About Me for testing
    user = {
      ...user,
      aboutMe: "This is a sample About Me section to test the feature. It demonstrates how longer content would appear in the profile card.",
      nitroProfileColor: "#ED4245", // Discord red
    };
    
    const card = await makeCard(user);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  const bannerOverride = req.query.banner as string;
  const aboutMeOverride = req.query.aboutMe as string;
  const hideDecoration = req.query.hideDecoration === 'true';
  const themeColorOverride = req.query.themeColor as string;
  const useProfileColor = req.query.useProfileColor === 'true';
  
  // Banner override must be a valid URL, and also shouldn't point to a local file
  if (bannerOverride && !bannerOverride.startsWith("http")) {
    res.status(400).send("Invalid banner URL");
    return;
  }
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  try {
    const user = await fetchUserInfo(client, id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    if (bannerOverride) {
      user.bannerURL = URItoBase64(bannerOverride);
    }
    if (aboutMeOverride) {
      user.aboutMe = aboutMeOverride;
    }
    if (hideDecoration) {
      user.avatarDecorationURL = null;
    }
    // Handle theme color settings
    if (themeColorOverride && themeColorOverride.match(/^#[0-9A-Fa-f]{6}$/)) {
      user.nitroProfileColor = themeColorOverride;
    } else if (!useProfileColor) {
      // If not using profile color and no valid override provided, clear the color
      user.nitroProfileColor = null;
    }
    
    const card = await makeCard(user);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}