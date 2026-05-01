const userModel = require('../models/user.model');

async function getUserInfo(req, res, next) {
    const id = req.userId;
    console.log("Hello");

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user; // ✅ attach user

        next();
    } catch (err) {
        console.log("getUserInfo error: ", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = getUserInfo;