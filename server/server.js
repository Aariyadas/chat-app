require("dotenv").config(); // Load environment variables from .env file

const mongoose = require("mongoose");
const express = require("express");

const app = express();
const userRoute = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messagesRoutes = require("./routes/messageRoutes");
app.use(express.json());

const server =require("http").createServer(app);

const io =require("socket.io")(server,{
  cors:{
    orgin:"http://localhost:3000",
    methods:["GET","POST"]
  },
});

// Check Connection of socket from client 
io.on("connection",(socket)=>{
  // Sockets events
  
  console.log("connection with socketId", socket.id);

});



app.use("/api/users", userRoute);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messagesRoutes);

const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
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
