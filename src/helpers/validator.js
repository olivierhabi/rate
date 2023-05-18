import Util from "./utilities";
import "joi";

const util = new Util();
export default (schema, toValidate, res, next) => {
  const { error } = schema.validate(toValidate);
  return error
    ? util.setErrorResponse(res, error.details[0].message, 422)
    : next();
};
