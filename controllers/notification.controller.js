const NotificationModel = require("../models/Notification.model");

const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.send({ status: true, notifications });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching notifications" });
  }
};

const markAsRead = async (req, res) => {
  try {
    await NotificationModel.updateMany({ userId: req.userId, isRead: false }, { isRead: true });
    res.send({ status: true, message: "Notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error updating notifications" });
  }
};

const createNotification = async (userId, message, type) => {
  try {
    await NotificationModel.create({ userId, message, type });
  } catch (error) {
    console.log("Error creating notification:", error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};
