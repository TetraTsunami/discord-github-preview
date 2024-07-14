import readyClient from "@/bot";
import { validateId, fetchUserInfo } from "@/helpers/discord";

export async function discordSelf(req: any, res: any): Promise<any> {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}

export async function discordUser(req: any, res: any): Promise<any> {
  const client = await readyClient;
  const id = req.params.id;
  if (!validateId(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  const user = await fetchUserInfo(client, id);
  res.status(200).send(user);
}