import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import { redisClient } from "./redis";

export const createRateLimitersForPlan = (plan) => {
  const perSecondLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: `middleware:${plan.type}:perSecond`,
    points: plan.ReqPerSec,
    duration: 1,
  });

  // Soft throttle rate limiter
  const perSecondSoftThrottleLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: `middleware:${plan.type}:perSecond:soft`,
    points: Math.max(1, Math.floor(plan.ReqPerSec / 2)), // 50% of the normal limit
    duration: 1,
  });

  const perMonthLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: `middleware:${plan.type}:perMonth`,
    points: plan.ReqPerMonth,
    duration: 60 * 60 * 24 * 30, // duration in seconds for one month
  });

  return { perSecondLimiter, perSecondSoftThrottleLimiter, perMonthLimiter };
};

export const fixedWindowRateLimiter = async (req, res, next) => {
  try {
    const client = req.user;

    const { perSecondLimiter, perSecondSoftThrottleLimiter, perMonthLimiter } =
      createRateLimitersForPlan(client.plan);

    try {
      // Try to consume a point from the normal rate limiter
      await perSecondLimiter.consume(client.email);
    } catch (_) {
      // If the normal rate limiter is exhausted, try to consume a point from the soft throttle rate limiter
      await perSecondSoftThrottleLimiter.consume(client.email);
    }
    try {
      await perMonthLimiter.consume(client.email);
      next();
    } catch (error) {
      const monthRateLimiterRes = await perMonthLimiter.get(client.email);

      if (monthRateLimiterRes && monthRateLimiterRes.remainingPoints === 0) {
        res.status(429).json({
          status: 429,
          message: `Your Monthly limit exceeded. Please wait until next month or upgrade plan.`,
        });
      } else {
        const secRateLimiterRes = await perSecondLimiter.get(client.email);
        let waitTimeSec = 0;

        if (secRateLimiterRes && secRateLimiterRes.msBeforeNext) {
          waitTimeSec = secRateLimiterRes.msBeforeNext / 1000;
        }

        return res.status(429).json({
          status: 429,
          message: `Too Many Requests. Please wait ${waitTimeSec} seconds`,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error });
  }
};
