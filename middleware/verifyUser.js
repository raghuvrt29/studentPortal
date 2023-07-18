const userService = require("../service/user.service");
const adminService = require("../service/admin.service");
const auth = require("../utils/authentication");

const verification = async (req, res, next) => {
    try {
        const tkn = req.header("Authorization");
        if (!tkn) {
            return res
                .status(401)
                .json({message:"No JWToken"});
        }
        const payload = await auth.decodeToken(tkn);
        if (!payload)
            return res
                .status(440)
                .send("Session expire, please login");
        if (payload.valid === false)
            return res
                .status(401)
                .send("invalid token");
        let person;
        if (payload.role === "admin") {
            person = await adminService.getAdminById(payload.id);
        }
        else {
            person = await userService.getUserById(payload.id);
        }
        if (person) {
            return next();
        }
        else {
            return res
                .status(401)
                .send( "Invalid token" );
        }
    }
    catch (error) {
        res.status(401).json({message:error.message});
    }

}

module.exports = verification;