const MessageModel = require("../models/Message.model");
const { createNotification } = require("./notification.controller");

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const newMessage = await MessageModel.create({
      senderId: req.userId,
      receiverId,
      content,
    });
    
    await createNotification(receiverId, `New message from ${req.userId}`, "message");

    res.send({ status: true, message: "Message sent", chat: newMessage });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error sending message" });
  }
};

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  try {
    const messages = await MessageModel.find({
      $or: [
        { senderId: req.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.userId },
      ],
    }).sort({ createdAt: 1 }).populate("senderId receiverId", "fullname username profilePicture content");
    res.send({ status: true, chat: messages });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching messages" });
  }
};

const getChatList = async (req, res) => {
  try {
    // Get unique users the current user has chatted with
    const messages = await MessageModel.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
    }).populate("senderId receiverId", "fullname username profilePicture content");

    const chatUsers = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.senderId._id.toString() === req.userId ? msg.receiverId : msg.senderId;
      chatUsers.set(otherUser._id.toString(), otherUser);
    });

    res.send({ status: true, chats: Array.from(chatUsers.values()) });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching chat list" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getChatList,
};
