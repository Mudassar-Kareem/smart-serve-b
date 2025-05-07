const express = require('express');
const { createOrder } = require('../controller/orderController');
const orderRoute = express.Router();

orderRoute.post("/create",createOrder)

module.exports = orderRoute;