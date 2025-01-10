import readyClient from "../bot";
import { makeCard } from "../helpers/card";
import { validateId, fetchUserInfo } from "../helpers/discord";
import type { RequestHandler } from "express";
import { URItoBase64 } from "../helpers/utils";

export const discordSelf: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  const bannerOverride = req.query.banner as string;
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
    const card = await makeCard(user);
    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(card);
  } catch (error) {
    next(error);
  }
}