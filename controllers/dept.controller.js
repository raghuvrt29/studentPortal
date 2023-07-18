const uuid = require("uuid").v4
const userService = require("../service/user.service")
const courseService = require("../service/course.service");
const deptService = require("../service/dept.service");
const fileService = require("../service/file.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const deptController = {
    viewDept: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            if (!dept)
                return res.status(400).json({ message: "invalid URL" });
            if (user.role == "admin" || (user.role === "hod" && user.dept === dept._id)) {
                return res.send(dept);
            }
            else {
                return res.status(401).send("You don't have access to this page");
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },

    changeHOD: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const dept = await deptService.getDeptById(req.params.deptId);
            if (!dept)
                return res.status(400).json({ message: "invalid URL" })
            if (user.role === "admin") {
                const { newHodEmail } = req.body;
                if (!newHodEmail)
                    return res.status(400).send("email id of the new HOD is not provided");
                const newHod = userService.getUserByEmail(newHodEmail);
                if (!newHod) return res.status(404).send("user with this email id doesn't exist");
                if (newHod.role !== "teacher" || newHod.dept !== dept._id)
                    return res.status(401).send("new HOD should be a teacher from this department only");

                await userService.toTeacher(dept.hod);
                await userService.toHod(newHod._id);
                const update = await deptService.changeHod(newHod);
                return res.send(update);
            }
            else {
                return res.status(401).send("you can't change HOD for this department");
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },

    addCourse: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const deptId = req.params.deptId;
            const dept = await deptService.getDeptById(deptId);
            if (!dept)
                return res.status(400).json({ message: "invalid URL" });
            if (user.role === "admin" || (user.role === "hod" && user.dept === deptId)) {
                const { courseName, teacherEmail } = req.body;
                if (!courseName || !teacherEmail)
                    return res.status(400).send("please fill all the fields");

                const teacher = await userService.getUserByEmail(teacherEmail);
                if (!teacher) return res.status(400).send("user with this email doesn't exist");
                if (teacher.dept !== deptId)
                    return res.status(401).send("the teacher of the course should be from the same department");

                const course = {
                    _id: uuid(),
                    name: courseName,
                    dept: deptId,
                    teacherId: teacher._id
                }
                let result = {
                    coursesUpdate: await courseService.addCourse(course),
                    deptUpdate: await deptService.addCourse(course.dept, course),
                    teacherUpdate: await userService.addCourse(teacher, course)
                }
                await fileService.addFolder(deptId,course._id);
                return res.send(result);
            }
            else {
                return res.status(401).send("you can't add courses to this department");
            }
        }
        catch (error) {
            res.status(401).send(error.message);
        }
    },

    remCourse: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const deptId = req.params.deptId;
            const dept = await deptService.getDeptById(deptId);
            if (!dept)
                return res.status(400).json({ message: "invalid URL" });

            if (user.role === "admin" || (user.role === "hod" && user.dept === dept._id)) {
                const { courseName } = req.body;
                if (!courseName)
                    return res.status(400).json({message:"course name is not provided"});

                const course = await courseService.getCourseByName(courseName);
                if(!course)
                    return res.status(400).json({message:"this course doesn't exist"});
                if (course.dept !== deptId)
                    return res.status(400).josn({message:"this course doesn't belong to this department"});

                await deptService.delCourse(course);
                await userService.delCourse(course.teacherId, course);
                const studs = course.students
                for (let i = 0; i < studs.length; i++) {
                    await userService.delCourse(studs[0].studentId, course);
                }
                let result = await courseService.delCourse(course);
                await fileService.delFolder(deptId,course._id);
                return res.send(result);
            }
            else {
                return res.status(401).send("you cannot remove courses in this department");
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },

    remUser: async (req, res) => {
        try {
            const user = await auth.decodeToken(req.header("Authorization"));
            const deptId = req.params.deptId;
            const dept = await deptService.getDeptById(deptId);
            if (!dept)
                return res.status(400).json({ message: "invalid URL" });
            if (admin.role === "admin" || (admin.role === "hod" && admin.dept === req.params.deptId)) {
                const { userEmail } = req.body;
                if (!userEmail)
                    return res.status(400).send("user email is not provided");

                const user = await userService.getUserByEmail(userEmail);
                if (!user) return res.status(400).send("user with this email id doesn't exist");
                if (user.dept !== req.params.deptId)
                    return res.status(400).send("the user doesn't belong to this department");

                if (user.role === "student") {
                    for (let i = 0; i < user.courses.length; i++) {
                        const course = await courseService.getCourseById(user.courses[i]);
                        await courseService.delStudent(course, user);
                    }
                    await deptService.delUser(user);
                    let update = await userService.delUser(user);
                    return res.send(update);
                }
                else if (user.role === "teacher") {
                    if (user.courses.length !== 0)
                        res.status(400).send("this teacher is still teaching some courses. so please change the teacher for those courses");
                    await deptService.delUser(user);
                    let update = await userService.delUser(user);
                    return res.send(update);
                }
                else if (user.role === "hod") {
                    return res.status(401).send("this user is hod of a department. so you please change hod of the department first");
                }
            }
            else {
                return res.status(401).send("you cannot remove students from this department");
            }
        }
        catch (error) {
            return res.send(error.message);
        }
    }
}

module.exports = deptController;