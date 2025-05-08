const express = require('express');
const { createOrder, getOrders, orderStatus, paymentStatus } = require('../controller/orderController');
const orderRoute = express.Router();
const { isUser } = require("../middleware/auth")

orderRoute.post("/create",createOrder)
orderRoute.get("/getOrders",isUser,getOrders)
orderRoute.put("/changeStatus/:id",isUser,orderStatus)
orderRoute.put("/paymentStatus/:id",isUser,paymentStatus)

module.exports = orderRoute;