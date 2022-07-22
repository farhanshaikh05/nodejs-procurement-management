const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageOrder'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth('getOrders'), orderController.getOrders);

router
.route('/:orderId')
.patch(auth('manageOrder'), validate(orderValidation.createOrder), orderController.updateOrder);

module.exports = router;
