const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/reset-password2", userController.resetPassword2);

module.exports = router;