const express=require("express");
const adminRoute=express.Router();
const verification=require("../middleware/verifyUser")
const cookieParser=require("cookie-parser")

adminRoute.use(cookieParser());
adminRoute.use(express.json());

const adminController=require("../controllers/admin.controller");

adminRoute.post("/signup",adminController.signupAdmin);

adminRoute.post("/login",adminController.loginAdmin);

adminRoute.get("/:adminId",verification,adminController.viewAdmin);

adminRoute.post("/:adminId",verification,adminController.addDept);

module.exports=adminRoute;