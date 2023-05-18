import { Router } from "express";
import Authentication from "../../controllers/authentication";
import * as validation from "../../middlewares/validations/users";

const router = Router();

router.post("/signup", validation.signup, Authentication.createAccount);
router.post("/login", validation.login, Authentication.login);

export default router;
