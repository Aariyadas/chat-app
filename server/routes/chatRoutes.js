const router = require("express").Router();
const Chat = require("../models/chatModel");
const authMiddleware = require("../middlewares/authmiddlewares");
const Message = require("../models/messageModel");
// Creating a new Chat
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();


    // populate members and last message in saved chat
    await savedChat.populate("members")
    res.send({
      success: true,
      message: "Chat created successfully",
      data: savedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
});

// get all chats of current users

router.get("/get-all-chats", authMiddleware, async (req, res) => {
 
  try {
    console.log("api");
    const chats = await Chat.find({
      members: {
        $in: [req.body.userId],
      },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    console.log(chats);
    res.send({
      success: true,
      message: "Chat fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
    
  }
});

router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  
  try {
    // Find chat and update unread message count to 0
    const chat = await Chat.findById(req.body.chat);
    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not Found",
      });
    }
    console.log(chat);
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chat,
      {
        unreadMessage: 0,
      },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");
   
    // Find all unread message of chat and update them as read

    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
      },
      {
        read: true,
      }
    );
    res.send({
      success: true,
      message: "Unread message cleared successfully",
      data: updatedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error clearing unread message",
      error: error.message,
    });
  
  }
});

module.exports = router;
