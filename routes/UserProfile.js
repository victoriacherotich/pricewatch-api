const express = require("express");
const router = express.Router();
const UserProfileController = require('../controllers/UserProfileController');
const authenticate = require('../middleware/auth');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profileimages/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+'-'+file.originalname)
    }
});

const upload = multer({storage: storage});
router.post('/v1/', authenticate, UserProfileController.createUserProfile);
router.patch('/v1/:id', authenticate, UserProfileController.updateUserProfile);
router.patch('/image/v1/:id', authenticate, upload.single('socket_auth_user_file'), UserProfileController.updateUserProfileImage);
router.get('/v1/:id', UserProfileController.getUserProfile);
router.patch('/paypalemail/v1/:id', authenticate, UserProfileController.updateUserPaypalEmailProfile);


module.exports = router; 