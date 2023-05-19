import { Router } from "express";
import * as validation from "../../middlewares/validations/email";

import Email from "../../controllers/email";
const router = Router();

router.post("/", validation.email, Email.sendEmail);
router.get("/heavy", Email.getEmail);

export default router;
