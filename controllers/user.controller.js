const uuid = require("uuid").v4
const userService = require("../service/user.service")
const subjectService = require("../service/course.service");
const deptService = require("../service/dept.service");
const auth = require("../utils/authentication");
require("dotenv").config();

const userController = {
    signupUser: async (req, res) => {
        try {
            const { name, email, dept, password, role } = req.body;

            if (!name || !email || !dept || !password || !role)
                return res.status(400).send("please fill all the fields");

            if (await userService.getUserByEmail(email))
                return res.status(400).send("you are already registered please login");

            const department = await deptService.getDeptByName(dept)
            if (!department)
                return res.status(400).send("please enter a valid department name");

            const user = {
                _id: uuid(),
                name: name,
                email: email,
                dept: department._id,
                password: password,
                role: role
            }
            await userService.addUser(user);
            await deptService.addUser(user);
            return res
                .status(200)
                .json({ message: "you are successfully registered, please login" });
        }
        catch (error) {
            res.send(error.message);
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).send("please fill all the fields");

            const user = await userService.getUserByEmail(email);
            if (user.password === password) {
                const payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    dept: user.dept,
                    password: user.password,
                    role: user.role
                }
                const tokens = await auth.signUser(payload);
                res.cookie('jwt', tokens.refToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true
                });
                return res.json({ accessToken: tokens.accToken });
            }

            else {
                return res
                    .status(401)
                    .json({ message: "Please check your password and email" })
            }
        }
        catch (error) {
            return res
                .status(401)
                .send(error.message);
        }
    },
    showUser: async (req, res) => {
        try {
            const id = req.params.userId;
            const user = await userService.getUserById(id);
            const courses = [];

            for (let i = 0; i < user.courses.length; i++) {
                let course = user.courses[i];
                courses.push(await subjectService.getCourseById(course).name);
            }

            return res.send({
                name: user.name,
                email: user.email,
                dept: user.dept,
                role: user.role,
                courses: courses
            })
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },
    changePassword: async (req, res) => {
        try {
            const id = req.params.userId;
            const user = await userService.getUserById(id);
            const { oldPassword, newPassword } = req.body;
            if (user.password === oldPassword) {
                const update = await userService.changePassword(user, newPassword);
                return res.send(update);
            }
            else {
                return res.status(401).send("Please enter the correct old password");
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },
    editDetails: async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.userId);
            let obj = {
                name: req.body.name,
                email: req.body.email
            }
            const update = await userService.editDetails(user._id, obj);
            return res.send(update);
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    }
}

module.exports = userController;