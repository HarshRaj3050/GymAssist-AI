const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/dashboard", authMiddleware, userController.dashboard);
router.get("/fit", authMiddleware, userController.fit);




module.exports = router;