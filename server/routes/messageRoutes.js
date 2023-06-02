const router = require("express").Router();
const Chat = require("../models/chatModel");

const Message = require("../models/messageModel");

const authMiddleware = require("../middlewares/authmiddlewares");

// new message
router.post("/new-message", async (req, res) => {
  try {
    // store message

    const newMessage = new Message(req.body);
    const savedMessage =await newMessage.save()

    //update last message of chat

    await Chat.findOneAndUpdate(
      { _id: req.body.chat },
      {
        lastMessage: savedMessage._id,
        unread: {
          $inc: 1,
        },
      }
    );
    res.send({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
});

router.post("/get-all-messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.send({
      success: true,
      message: "Messages fetched sucessfully",
      data: messages,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error fetching message",
    });
  }
});

module.exports= router;
