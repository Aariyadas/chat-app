require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const userRoute=require("./routes/userRoutes")
app.use(express.json());

app.use("/api/users",userRoute)





const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    
  })
  .catch((error) => {
    console.log('MongoDB connection failed');
    console.error(error);
  });
  app.listen(port, () => console.log(`Server running on port ${port}`));