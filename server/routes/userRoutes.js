const User = require("../models/userModel"); // Import the User model

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authmiddlewares = require("../middlewares/authmiddlewares");
const cloudinary =require("../cloudinary")


router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const { email, password } = req.body;
    if (!email) {
      return res.send({
        success: false,
        message: "Email is required",
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.send({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!password || password.length < 6) {
      return res.send({
        success: false,
        message: "Password needs to have at least 6 characters",
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        message: "User already exists",
        success: false,
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "Invalid Data ",
      });
    }
    // check password correct

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        message: error.message,
        success: false,
      });
    }

    // create and assign token

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24d",
    });
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-current-user", authmiddlewares, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    res.send({
      success: true,
      message: "User Fetched Successfully",
      data: user,
    });
  } catch {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// get all users except current users

router.get("/get-all-users", authmiddlewares, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.body.userId } });
    res.send({
      success: true,
      message: "Users fetched sucessfully",
      data: allUsers,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});


// update user profile picture
router.post("/update-profile-picture",authmiddlewares,async(req,res)=>{
  try{
    const image =req.body.image;
    // upoad to cloudinary and to get the url 
    const uploadedImage =await cloudinary.uploader.upload(image,{
      folder :"chat-app",
    })
    // update user profile picture
    const user =await User.findOneAndUpdate(
      {_id:req.body.userId},
      {profilePic:uploadedImage.secure_url},
      {new:true}

    )
    res.send({
      success:true,
      message:"Profile Picture Updated Sucessfully",
      data:user,
    })

  }catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})




module.exports = router;
