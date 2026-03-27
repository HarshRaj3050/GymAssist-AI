const jwt = require('jsonwebtoken');
const config = require('../config/config');

async function isAuthenticated(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Don't have token"
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userID = decoded.id;
        next();

    } catch (err) {
        console.log("Error: ", err);
        return res.status(401).json({
            message: "Invalid Token"
        })
    }


}

module.exports = isAuthenticated;