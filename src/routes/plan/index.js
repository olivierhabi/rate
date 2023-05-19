import { Router } from "express";
import * as validation from "../../middlewares/validations/plan.js";

import Plan from "../../controllers/plan";
const router = Router();

router.post("/", validation.plan, Plan.upgradePlan);

export default router;
