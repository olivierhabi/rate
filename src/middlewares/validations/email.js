import EmailSchema from "./schemas/email/email";
import validator from "../../helpers/validator";

export const email = (req, res, next) => {
  validator(EmailSchema, req.body, res, next);
};
