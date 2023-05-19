import Joi from "joi";

export default Joi.object()
  .keys({
    planId: Joi.number().min(1).required(),
  })
  .options({ allowUnknown: false });
