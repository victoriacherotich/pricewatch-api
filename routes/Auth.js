const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/AuthController')
const authenticate = require("../middleware/auth");

router.post('/v1/', AuthController.AuthenticateUser);
router.post('/aouth/v1/', AuthController.AuthenticateUserFacebook);
router.post('/logout/v1/:id', AuthController.LogoutStatus);

module.exports = router;