const jwt = require("jsonwebtoken")

const refreshToken = async (req, res) => {
    try {
        if (req.cookies.jwt) {
            const refreshTkn = req.cookies.jwt;
            jwt.verify(refreshTkn, process.env.JWT_REF_SECRET,
                (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    else {
                        const accessToken = jwt.sign({
                            user: decoded.user
                        }, process.env.JWT_ACC_SECRET, { expiresIn: '1h' })
                        return res.json({ accessToken: accessToken });
                    }
                })
        }
    }
    catch (error) {
        return res.json({message:error.message});
    }
}

module.exports = refreshToken