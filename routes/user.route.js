const express=require("express");
const userRoute=express.Router();
const verification=require("../middleware/verifyUser")
const cookieParser=require("cookie-parser")

userRoute.use(cookieParser());
userRoute.use(express.json());

const userController=require("../controllers/user.controller");

userRoute.post("/signup",userController.signupUser);

userRoute.post("/login",userController.loginUser);

userRoute.get("/:userId",verification,userController.showUser);

userRoute.patch("/:userId/changePassword",verification,userController.changePassword);

userRoute.patch("/:userId/editDetails",verification,userController.editDetails);

module.exports=userRoute;