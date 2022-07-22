const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);

  return res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await orderService.queryOrder(filter, options, req.user);
  res.send(result);
});

const updateOrder = catchAsync(async (req, res) => {
  await orderService.updateOrder(req.params.orderId, req.body);

  return res.status(httpStatus.OK).send({
    message: 'Order status updated'
  });
});

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
};
