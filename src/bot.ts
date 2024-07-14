import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers, 
  GatewayIntentBits.GuildPresences,
] });

let readyClient: Promise<Client<true>>;

client.login(process.env.DISCORD_TOKEN);

readyClient = new Promise((resolve) => {
  client.once(Events.ClientReady, readyClient => {
    console.log(`Discord logged in as ${readyClient.user.tag}`);
    resolve(readyClient);
  });
});

export default readyClient;