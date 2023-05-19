import Redis from "ioredis";
require("dotenv").config();

const REDIS_URL = process.env.REDIS_URL;

export const redisClient = new Redis(REDIS_URL);
