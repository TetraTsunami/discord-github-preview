import express from "express";
import { discordSelf, discordUser } from "@/api";
import 'dotenv/config';

const app = express();

app.get("/api", discordSelf);
app.get("/api/user/:id", discordUser);

export default app;