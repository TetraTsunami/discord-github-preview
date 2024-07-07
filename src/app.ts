import express from "express";
import { discordUser } from "./api";
import 'dotenv/config';

const app = express();

app.get("/api", discordUser);

export default app;