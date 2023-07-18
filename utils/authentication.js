const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = {
    signUser: async payload => {
        try {
            let result = {};
            result.accToken = jwt.sign(payload, process.env.JWT_ACC_SECRET, { expiresIn: "1h" });
            result.refToken = jwt.sign(payload, process.env.JWT_REF_SECRET, { expiresIn: "1d" });
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    decodeToken: async token => {
        let decodedPayload = {};
        try {
            decodedPayload = jwt.verify(token, process.env.JWT_ACC_SECRET);
            if (decodedPayload.exp >= (Date.now() / 1000)) {
                decodedPayload.valid = true;
            }
            else {
                decodedPayload.valid = false;
            }
            return decodedPayload;
        }
        catch (error) {
            return decodedPayload.valid = false;
        }
    }
}

module.exports = authentication;