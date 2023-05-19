import PlanSchema from "./schemas/plan/plan";
import validator from "../../helpers/validator";

export const plan = (req, res, next) => {
  validator(PlanSchema, req.body, res, next);
};
