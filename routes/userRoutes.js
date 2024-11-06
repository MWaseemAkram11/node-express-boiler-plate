const express = require('express')
const {getUsers, getUser, updateUser, deleteUser, profileUpdate, profileFee } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware');
// const uploadOptions = require('../utils/multerHelper');
const upload = require('../config/multer');
const router = express.Router();

router.get('/users',authMiddleware, getUsers)
router.get('/users/:id',authMiddleware,getUser)
router.delete('/users/:id',authMiddleware,deleteUser)
router.put('/users/:id',authMiddleware,  upload.fields([{ name: 'image', maxCount: 1 }]), updateUser);
router.put('/profile/update',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }]), profileUpdate)
router.put('/registration-fee',authMiddleware, upload.fields([{ name: 'paymentProof', maxCount: 1 }]),profileFee)

module.exports = router;