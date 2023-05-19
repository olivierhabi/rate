import Joi from "joi";

export default Joi.object()
  .keys({
    sender_email: Joi.string().email().required(),
    recipient_email: Joi.string().email().required(),
    subject: Joi.string().required(),
    body: Joi.string().min(8).required(),
  })
  .options({ allowUnknown: false });
