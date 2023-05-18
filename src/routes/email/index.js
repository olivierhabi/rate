import { Router } from "express";

import Email from "../../controllers/email";
const router = Router();

router.get("/", Email.sendEmail);
router.get("/heavy", Email.sendEmail);

export default router;
