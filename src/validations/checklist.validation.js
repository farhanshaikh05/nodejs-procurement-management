const Joi = require('joi');
const { objectId } = require('./custom.validation');
const types = ["textbox", "radio", "checkbox", "dropdown", "file"];

const createChecklist = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    orderId: Joi.string().required().custom(objectId),
    fields: Joi.array().items(
      Joi.object().keys({
        type: Joi.string().required().valid(...types),
        name: Joi.string().required(),
        options: Joi.optional(),
        isRequired: Joi.boolean().required(),
      })
      )
  }),
};

const fillChecklist = {
  body: Joi.array().items(
    Joi.object().keys({
      fieldId: Joi.string().required().custom(objectId),
      value: Joi.any(),
    })
  )
};


module.exports = {
  createChecklist,
  fillChecklist,
};
