import express from "express";
import apicache from "apicache";
import { discordSelf, discordUser } from "./api";
import 'dotenv/config';
import { Request, Response, NextFunction } from "express";

const app = express();

const cache = apicache.middleware;

app.get("/api/ping", discordSelf);
app.get("/api/user/:id", cache(process.env.NODE_ENV === 'development' ? '1 second' : '5 minutes'), discordUser);

export default app;