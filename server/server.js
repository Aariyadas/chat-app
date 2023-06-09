require("dotenv").config(); // Load environment variables from .env file

const mongoose = require("mongoose");
const express = require("express");

const app = express();
const userRoute = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messagesRoutes = require("./routes/messageRoutes");
app.use(
  express.json({
    limit: "1000mb",
  })
);

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    orgin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Check Connection of socket from client
let onlineUsers = [];
io.on("connection", (socket) => {
  // Sockets events
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });
  // Send message to clients (who are present in members array)
  socket.once("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);
  });
  // clear unread messages
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unread-messages-clear", data);
  });
  //  typing event
  socket.on("typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  // online users

  socket.on("came-online", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }

    io.emit("online-users", onlineUsers);
  });
  socket.on("went-offline", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    console.log(onlineUsers);
    io.emit("online-users-updated", onlineUsers);
  });
});

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messagesRoutes);

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.error(error);
  });
server.listen(port, () => console.log(`Server running on port ${port}`));
