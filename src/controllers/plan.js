import PlanService from "../service/plan";
import UserService from "../service/user";
import { createRateLimitersForPlan } from "../helpers/service";

class Plan {
  static async upgradePlan(req, res) {
    try {
      const plan = await PlanService.getPlanById(req.body.planId);
      if (!plan) {
        return res
          .status(404)
          .json({ status: 404, message: "Plan can not be found with that id" });
      }

      const updateUser = await UserService.upgradeUserPlan(
        req.user.id,
        plan.id
      );

      const client = req.user;

      const {
        perSecondLimiter,
        perSecondSoftThrottleLimiter,
        perMonthLimiter,
      } = createRateLimitersForPlan(client.plan);

      await perSecondLimiter.delete(client.email);
      await perSecondSoftThrottleLimiter.delete(client.email);
      await perMonthLimiter.delete(client.email);

      return res.status(200).json({
        status: 200,
        message: `Plan is upgraded successfully to ${updateUser?.Plan?.type}`,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
}

export default Plan;
