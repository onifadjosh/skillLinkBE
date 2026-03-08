const express = require("express");
const { sendMessage, getMessages, getChatList } = require("../controllers/message.controller");
const { verifyToken } = require("../controllers/user.controller");

const messageRouter = express.Router();

messageRouter.post("/send", verifyToken, sendMessage);
messageRouter.get("/list", verifyToken, getChatList);
messageRouter.get("/:otherUserId", verifyToken, getMessages);

module.exports = messageRouter;
