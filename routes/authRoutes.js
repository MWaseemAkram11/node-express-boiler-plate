const express = require('express');
const {register,login, forgotPassword, changePassword, resetPassword} = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
// router.post('/change-password', authMiddleware([]), changePassword)

module.exports = router;