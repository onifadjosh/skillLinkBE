const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["message", "order", "system"], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
});

const NotificationModel = mongoose.model("notifications", NotificationSchema);

module.exports = NotificationModel;
