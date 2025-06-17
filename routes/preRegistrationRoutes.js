const express = require("express");
const router = express.Router();
const preRegistrationController = require("../controllers/preRegistrationController");

router.post("/send-otp", preRegistrationController.sendOtp);
router.post("/verify-and-register", preRegistrationController.createPreRegistration);
router.get("/", preRegistrationController.getAllPreRegistration);
router.get("/:id", preRegistrationController.getPreRegistrationById);


module.exports = router;