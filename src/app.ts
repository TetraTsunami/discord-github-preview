import express from "express";
import apicache from "apicache";
import { discordSelf, discordUser } from "./api";
import 'dotenv/config';

const app = express();
const cache = apicache.middleware;

app.get("/api/ping", discordSelf);
app.get("/api/user/:id", cache('5 minutes'), discordUser);

export default app;