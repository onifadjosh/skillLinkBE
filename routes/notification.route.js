const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notification.controller");
const { verifyToken } = require("../controllers/user.controller");

const notificationRouter = express.Router();

notificationRouter.get("/", verifyToken, getNotifications);
notificationRouter.post("/mark-read", verifyToken, markAsRead);

module.exports = notificationRouter;
