const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    userId: Joi.string().required().custom(objectId),
    price: Joi.number().required(),
  }),
};

const updateOrder = {
  body: Joi.object().keys({
    status: Joi.string().required().valid('pending', 'assigned', 'toConfirm', 'completed'),
  }),
};

module.exports = {
  createOrder,
  updateOrder,
};
