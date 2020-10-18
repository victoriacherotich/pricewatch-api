const express = require("express");
const router = express.Router();
const UserRegistrationController = require('../controllers/UserRegistrationController')
const authenticate = require('../middleware/auth');

router.post('/v1/', UserRegistrationController.createUser);
router.post('/admin/v1/', UserRegistrationController.createAdmin);
router.get('/v1/', UserRegistrationController.getUserPrivilage);


router.get('/v1/mail/', UserRegistrationController.mailUS);
router.get('/v1/userCount/:id', UserRegistrationController.userCount);

router.get('/users/v1/', UserRegistrationController.getAllUsers);
router.get('/notifications/v1/:id', authenticate, UserRegistrationController.getallNotifications);
router.patch('/single/v1/:id', UserRegistrationController.updateSingleNotifications);
router.patch('/all/v1/:id', UserRegistrationController.updateAllNotifications);
router.patch('/v1/:id', UserRegistrationController.updateUserPassword);
router.patch('/passreset/v1/', UserRegistrationController.sendUserPasswordResetCode);
router.patch('/passresetsuccess/v1/', UserRegistrationController.successPasswordReset);

module.exports = router;