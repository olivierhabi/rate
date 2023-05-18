import SignupSchema from "./schemas/user/signup";
import LoginSchema from "./schemas/user/login";
import validator from "../../helpers/validator";

export const signup = (req, res, next) => {
  validator(SignupSchema, req.body, res, next);
};
export const login = (req, res, next) => {
  validator(LoginSchema, req.body, res, next);
};
