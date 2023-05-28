const jwt =require("jsonwebtoken")


module.exports =(req,res,next) =>{
    try{
        console.log("valid")
        const token =req.headers.authorization.split(" ")[1];
        const decoded =jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId =decoded.userId;
        next()
    }catch(error){

    }
}