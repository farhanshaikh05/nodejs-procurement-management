const Joi = require('joi');
const { password } = require('./custom.validation');
const { roles } = require('../config/roles');


const login = {
  body: Joi.object().keys({
    email: Joi.any().when('type', { is: 'inspection', then: Joi.optional(), otherwise: Joi.string().required().email() }),
    password: Joi.string().required(),
    type: Joi.string().required().valid(...roles),
    phone: Joi.any().when('type', { is: 'inspection', then: Joi.string().required(), otherwise: Joi.optional() })
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login,
  logout,
};
