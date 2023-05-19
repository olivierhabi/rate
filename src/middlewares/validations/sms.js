import SMSSchema from "./schemas/sms/sms";
import validator from "../../helpers/validator";

export const sms = (req, res, next) => {
  validator(SMSSchema, req.body, res, next);
};
