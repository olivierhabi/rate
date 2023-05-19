import jwt from "../helpers/jwt";
import UserService from "../service/user";
import { STARTER_PLAN } from "../config/starterPlan";

class Access {
  static async auth(req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid access token" });
      }
      const token = req.headers.authorization.slice(7);

      const decoded = jwt.jwtVerify(token, process.env.SECRET);

      const { email } = decoded;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid access token" });
      } else {
        if (user.planId) {
          delete user.planId;
          delete user.Plan?.id;
          user.Plan.ReqPerMonth = parseInt(user.Plan.ReqPerMonth);
          user.Plan.ReqPerSec = parseInt(user.Plan.ReqPerSec);
        } else {
          user.Plan = STARTER_PLAN;
        }

        req.user = {
          email: user.email,
          id: user.id,
          plan: { ...user.Plan },
        };
        next();
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
}

export default Access;
