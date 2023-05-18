import Redis from "ioredis";

export const redisClient = new Redis(
  "redis://default:rNThiC2CWUvLpCzT78lv@containers-us-west-127.railway.app:8058"
);

// export const redisClient = new Redis({
//   enableOfflineQueue: true,
//   lazyConnect: true,
// });
