const jwt = require("jsonwebtoken")
const userService = require("../service/user.service")
const courseService = require("../service/course.service");
const fileService =  require("../service/file.service");
const deptService = require("../service/dept.service");
const auth =require("../utils/authentication");
require("dotenv").config();

const courseController = {
    viewCourse: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });
            const teacher = await userService.getUserById(course.teacherId);

            if (user.role == "student") {
                const isEnrolled = await courseService.getStudMarksById(user.id, course._id);
                if (!isEnrolled)
                    return res.status(401).send("You are not enrolled in this subject");

                let result = {
                    teacher: teacher.name,
                    marks: isEnrolled.marks,
                    resources: course.resources
                }
                return res.send(result);
            }
            else if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                let result = {
                    teacher: teacher.name,
                    students: course.students,
                    resources: course.resources
                }
                return res.send(result);
            }
            else {
                return res.status(400).send("you can not access this page");
            }
        }
        catch (error) {
            res.status(401).send(error.message)
        }
    },

    changeTeacher: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });
            if ((user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const { newTeachEmail } = req.body;
                if (!newTeachEmail)
                    return res.status(400).send("provide the email of the new teacher");
                const newTeach = await userService.getUserByEmail(newTeachEmail);
                if (!newTeach) return res.status(404).send("user with this email not found");
                if (newTeach.role) return res.status(400).send("this user is not a teacher");
                if (newTeach.dept !== course.dept) return res.status(400).send("teacher should be from the same department");

                await userService.delCourse(course.teacherId, course);
                await userService.addCourse(newTeach, course);
                const update = await courseService.changeTeacher(course, teacher);
                return res.send(update);
            }
            else {
                return res.status(401).send("you cannot change the teacher of this course");
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },

    addStudent: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });
            if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const studEmail = req.body.email;
                if (!studEmail)
                    return res.status(400).send("please fill the email of the student");

                const stud = await userService.getUserByEmail(studEmail);
                if (!stud)
                    return res.status(404).send("there is no user with given email");
                else if (stud.role === "student" && stud.dept === course.dept) {
                    const isEnrolled = await courseService.getStudMarksById(course._id, stud._id);
                    if (isEnrolled)
                        return res.status(400).send("this student is already enrolled in this subject");

                    let update = {
                        courseUpdate: await courseService.addStudent(course, stud),
                        studUpdate: await userService.addCourse(stud, course)
                    }
                    return res.send(update);
                }
                else {
                    return res.status(400).send("Please provide the email of a student who is in the same department");
                }
            }
            else {
                return res.status(401).send("You can not add students to this course");
            }
        }
        catch (error) {
            res.status(401).send(error.message);
        }
    },

    delStudent: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });
            if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const stud = await userService.getUserByEmail(req.body.email);
                if (!stud)
                    return res.status(404).send("there is no user with given email");
                else if (stud.role === "student" && stud.dept === course.dept) {
                    const isEnrolled = await courseService.getStudMarksById(course._id, stud._id);
                    if (!isEnrolled)
                        return res.status(400).send("this student is not enrolled in this subject");

                    let update = {
                        courseUpdate: await courseService.delStudent(course, stud),
                        studUpdate: await userService.delCourse(stud, course)
                    }
                    return res.send(update);
                }
                else {
                    return res.status(400).send("Please provide the email of a student who is in the same department");
                }
            }
            else {
                return res.status(401).send("You can not remove students from this course");
            }
        }
        catch (error) {
            return res.send(error.message);
        }
    },

    editMarks: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });
            if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const { email, marks } = req.body;
                if (!email || !marks)
                    return res.status(400).send("please fill all the fields");

                const stud = await userService.getUserByEmail(email);
                if (stud.role !== "student")
                    return res.status(401).send("this email doesn't belong to a student");
                const isEnrolled = await courseService.getStudMarksById(course._id, stud._id);
                if (!isEnrolled)
                    return res.status(401).send("this student is not enrolled in this course");

                const update = await courseService.editStudMarksById(course._id, stud._id, marks);
                return res.send(update);
            }
            else {
                return res.status(401).send("You can not edit marks of the students in this course");
            }
        }
        catch (error) {
            res.status(401).send(error.message)
        }
    },

    uploadResource: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });

            if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const update=courseService.addResource(course._id,req.file.filename);
                return res.json({result:update});
            }
            else {
                await fileService.delFile(req.file.path);
                return res.status(401).send("You can not add resources to this course");
            }
        }
        catch (error) {
            res.status(401).send(error.message);
        }
    },

    remResource: async (req,res) => {
        try{
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            const course = await courseService.getCourseById(req.params.courseId);
            if (!dept || !course)
                return res.status(400).json({ message: "invalid URL" });

            if (user.id === course.teacherId || (user.role === "hod" && user.dept === course.dept) || user.role === "admin") {
                const {fileName}= req.body;
                if(!fileName)
                    return res.status(400).json({message:"please provide the name of the file"})
                const update= await fileService.delFile("./uploads/"+dept._id+"/"+course._id+"/"+fileName);
                return res.json({result:update});
            }
            else {
                return res.status(401).send("You can not renove resources from this course");
            }
        }
        catch(error){
            throw error;
        }
    }
}

module.exports = courseController;