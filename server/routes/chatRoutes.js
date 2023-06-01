const router = require("express").Router();
const Chat = require("../models/chatModel");
const authMiddleware=require("../middlewares/authmiddlewares")
// Creating a new Chat
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();
    console.log(savedChat)
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
    console.log("chats")
  try {
    console.log("api")
    const chats = await Chat.find({
      members: {
        $in:[req.body.userId],
      },
    }).populate("members").sort({updatedAt:-1});
    console.log(chats)
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
    console.log(error)
  }
});



module.exports=router;