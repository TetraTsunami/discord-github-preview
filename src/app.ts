import express from "express";
import apicache from "apicache";
import { discordSelf, discordUser, discordUsername } from "./api";
import 'dotenv/config';

const app = express();
const cache = apicache.middleware;

app.get("/", express.static("public"));

app.get("/api/ping", discordSelf);
app.get("/api/user/:id", cache(process.env.NODE_ENV === 'development' ? '1 second' : '30 seconds'), discordUser);
app.get("/api/username/:id", cache(process.env.NODE_ENV === 'development' ? '1 second' : '30 seconds'), discordUsername);

export default app;
