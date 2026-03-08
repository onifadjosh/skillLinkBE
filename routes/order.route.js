const express = require("express");
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/order.controller");
const { verifyToken } = require("../controllers/user.controller");

const orderRouter = express.Router();

orderRouter.post("/create", verifyToken, createOrder);
orderRouter.get("/", verifyToken, getOrders);
orderRouter.post("/update-status", verifyToken, updateOrderStatus);

module.exports = orderRouter;
