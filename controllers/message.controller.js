const MessageModel = require("../models/Message.model");
const { createNotification } = require("./notification.controller");

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const newMessage = await MessageModel.create({
      senderId: req.userId,
      receiverId,
      content,
      isRead: false
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
    // Mark messages as read (where current user is receiver)
    await MessageModel.updateMany(
      { senderId: otherUserId, receiverId: req.userId, isRead: { $ne: true } },
      { $set: { isRead: true } }
    );

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
    // 1. Get all messages where the user is a participant
    const messages = await MessageModel.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
    })
    .sort({ createdAt: -1 })
    .populate("senderId receiverId", "fullname username profilePicture");

    const chatGroups = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.senderId._id.toString() === req.userId ? msg.receiverId : msg.senderId;
      const otherUserId = otherUser._id.toString();

      if (!chatGroups.has(otherUserId)) {
        chatGroups.set(otherUserId, {
          otherUser,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          lastSenderId: msg.senderId._id.toString(),
          unreadCount: 0
        });
      }
      
      // Count unread messages (where current user is receiver)
      if (msg.receiverId._id.toString() === req.userId && !msg.isRead) {
        chatGroups.get(otherUserId).unreadCount += 1;
      }
    });

    // Convert map to array and sort by most recent activity
    const chats = Array.from(chatGroups.values()).sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.send({ status: true, chats });
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
