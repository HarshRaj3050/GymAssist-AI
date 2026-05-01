const jwt = require('jsonwebtoken');
const config = require('../config/config');

async function isAuthenticated(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No token found");
        return res.status(401).json({
            message: "Don't have token"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user = decoded;
        console.log(req.user.name);
        console.log(decoded);


        next();
    } catch (err) {
        console.log("JWT Error:", err);
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
}

module.exports = isAuthenticated;