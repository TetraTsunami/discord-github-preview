import { Client } from "discord.js";


export const validateId = (id: string) => {
  return id.match(/^[0-9]{17,19}$/);
}

export async function fetchUserInfo(client: Client<true>, id: string) {
  const user = await client.users.fetch(id);
  return user.toJSON();
}