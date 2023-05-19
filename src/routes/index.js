import { Router } from "express";
import { fixedWindowRateLimiter } from "../helpers/service";
import Authentication from "./authentication";
import Access from "../middlewares/authentication";

import Email from "./email";
import Sms from "./sms";
import Plan from "./plan";

const appRouter = Router();
appRouter.use("/auth", Authentication);
appRouter.use("/plan", Access.auth, Plan);
appRouter.use(Access.auth, fixedWindowRateLimiter);
appRouter.use("/email", Access.auth, Email);
appRouter.use("/sms", Access.auth, Sms);

export default appRouter;
