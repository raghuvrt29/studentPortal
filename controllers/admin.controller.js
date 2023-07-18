const uuid = require("uuid").v4
const adminService = require("../service/admin.service")
const deptService = require("../service/dept.service");
const userService = require("../service/user.service");
const auth = require("../middleware/authentication");
require("dotenv").config();

const adminController = {
    signupAdmin: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password)
                return res.status(400).send("please fill all the fields");

            if (await adminService.getAdminByEmail(email))
                return res.status(400).send("you are already registered please login");

            const admin = {
                _id: uuid(),
                name: name,
                email: email,
                password: password,
                role:"admin"
            }
            await adminService.addAdmin(admin);
            return res
                .status(200)
                .json({ message: "admin is successfully registered, please login" });
        }
        catch (error) {
            return res.send(error.message);
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).send("please fill all the fields");

            const admin = await adminService.getAdminByEmail(email);
            if (admin.password === password) {
                const payload = {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    password: admin.password,
                    role: admin.role
                }
                const tokens =await auth.signUser(payload);
                res.cookie('jwt', tokens.refToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true
                });
                return res.json({ accessToken: tokens.accToken });
            }
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },
    viewAdmin: async (req, res) => {
        try {
            id = req.params.adminId;
            const admin = await adminService.getAdminById(id);
            return res.send(admin);
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    },
    addDept: async (req, res) => {
        try {
            const admin=await adminService.getAdminById(req.params.adminId);
            const { deptName, hodName, hodEmail } = req.body;
            if (!deptName || !hodName || !hodEmail)
                return res.status(400).send("Please fill all the fields");

            const deptId = uuid();
            const hod = {
                _id: uuid(),
                name: hodName,
                email: hodEmail,
                dept: deptId,
                password: uuid(),
                role: "hod"
            }
            const dept = {
                _id: deptId,
                name: deptName,
                hod: hod._id
            }
            await deptService.addDept(dept);
            await userService.addUser(hod);
            await adminService.addDept(admin,dept._id);
            await deptService.addUser(hod);
            return res.send("This is the password for the account of HOD: " + hod.password);
        }
        catch (error) {
            return res.status(401).send(error.message);
        }
    }
}

module.exports = adminController;