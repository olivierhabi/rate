import { Router } from "express";
import { fixedWindowRateLimiter } from "../helpers/service";
import Authentication from "./authentication";
import Access from "../middlewares/authentication";

import Email from "./email";

const appRouter = Router();
appRouter.use("/auth", Authentication);
// appRouter.use(Access.auth, fixedWindowRateLimiter);
// appRouter.use("/email", Access.auth, Email);
appRouter.use("/email", Email);

export default appRouter;
