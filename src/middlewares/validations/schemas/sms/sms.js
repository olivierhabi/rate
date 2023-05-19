import Joi from "joi";

export default Joi.object()
  .keys({
    phone: Joi.string().min(2).required(),
    message: Joi.string().min(2).required(),
    sender: Joi.string().min(8).required(),
  })
  .options({ allowUnknown: false });
