import readyClient from "@/bot";
import { makeCard } from "@/helpers/card";
import { validateId, fetchUserInfo, demoUser } from "@/helpers/discord";
import type { RequestHandler } from "express";

export const discordSelf: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export const discordUser: RequestHandler = async (req, res, next) => {
  const client = await readyClient;
  const id = req.params.id;
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  try {
    // const user = await fetchUserInfo(client, id);
    const user = demoUser;
    if (!user) {
      res.status(404).send("User not found");
    }
    const card = makeCard(user);
    res.status(200).send(card);
  } catch (error) {
    next(error);
  }
}