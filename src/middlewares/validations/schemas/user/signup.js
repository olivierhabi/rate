import Joi from "joi";

export default Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
  })
  .options({ allowUnknown: false });
