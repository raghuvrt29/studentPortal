const express=require("express");
const verification=require("../middleware/verifyUser")
const cookieParser=require("cookie-parser")
const upload =require("../middleware/uploadFile");

const deptRoute=express.Router();
deptRoute.use(cookieParser());
deptRoute.use(express.json());

const deptController=require("../controllers/dept.controller");
const courseController = require("../controllers/course.controller");

deptRoute.get("/:deptId",verification,deptController.viewDept);

deptRoute.post("/:deptId",verification,deptController.addCourse);

deptRoute.delete("/:deptId",verification,deptController.remCourse);

deptRoute.get("/:deptId/:courseId",verification,courseController.viewCourse);

deptRoute.post("/:deptId/:courseId",verification,courseController.addStudent);

deptRoute.delete("/:deptId/:courseId",verification,courseController.delStudent);

deptRoute.patch("/:deptId/:courseId",verification,courseController.editMarks);

deptRoute.post("/:deptId/:courseId/resources",verification,upload.single("file"),courseController.uploadResource);

deptRoute.delete("/:deptId/:courseId/resources",verification,courseController.remResource);

module.exports=deptRoute;