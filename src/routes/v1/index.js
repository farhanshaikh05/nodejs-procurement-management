const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const checklistRoute = require('./checklist.route');
const orderRoute = require('./order.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/checklist',
    route: checklistRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
