import { Router } from "express";
import * as validation from "../../middlewares/validations/sms";

import Sms from "../../controllers/sms";
const router = Router();

router.post("/", validation.sms, Sms.sendSMS);

export default router;
