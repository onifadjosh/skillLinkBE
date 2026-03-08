const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const MessageModel = mongoose.model("messages", MessageSchema);

module.exports = MessageModel;
