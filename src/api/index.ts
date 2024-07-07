import readyClient from "@/bot";

export async function discordUser(req: any, res: any): Promise<any> {
  const client = await readyClient;
  res.status(200).send(`Discord logged in as ${client.user.username}`);
}
