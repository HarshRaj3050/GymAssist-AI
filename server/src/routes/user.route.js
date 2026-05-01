const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const getUserInfo = require('../middleware/getUserInfo.middleware');

router.get("/dashboard", authMiddleware, getUserInfo, userController.dashboard);
router.get("/fit", authMiddleware, userController.fit);




module.exports = router;