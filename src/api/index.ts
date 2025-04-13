import readyClient from "../bot";
import { CardOptions, makeCard } from "../helpers/card";
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
    const options: CardOptions = {
      aboutMe: "This is a test about me section",
      themeType: "nitroDark",
      nitroColor1: "#7289DA", // Discord blue
      nitroColor2: "#99AAB5", // Discord grey
      overrideBannerUrl: null,
      hideDecoration: false,
    }
    
    const card = await makeCard(user, options);
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
  const options: CardOptions = {
    overrideBannerUrl: req.query.banner as string | null,
    aboutMe: req.query.aboutMe as string | null,
    hideDecoration: req.query.hideDecoration === 'true',
    themeType: req.query.theme as "dark" | "light" | "custom" | "nitroDark" | "nitroLight" | undefined || "dark",
    nitroColor1: req.query.primary as string | null || "#ecaff3",
    nitroColor2: req.query.accent as string | null || "#44a17a",
  }
  if (options.themeType === "custom") {
    options.customColors = {
      background: req.query.colorB1 as string | null || "#111214",
      secondaryBackground: req.query.colorB2 as string | null || "#313338",
      tertiaryBackground: req.query.colorB3 as string | null || "#505059",
      text: req.query.colorT1 as string | null || "#fff",
      secondaryText: req.query.colorT2 as string | null || "#d2d6d8",
    }
  }
  
  // Banner override must be a valid URL, and also shouldn't point to a local file
  if (options.overrideBannerUrl && !options.overrideBannerUrl.startsWith("http")) {
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
    if (options.overrideBannerUrl) {
      user.bannerURL = URItoBase64(options.overrideBannerUrl);
    }
    const card = await makeCard(user, options);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}