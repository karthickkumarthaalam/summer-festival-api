const express = require("express");
const router = express.Router();
const preRegistrationController = require("../controllers/preRegistrationController");


router.post("/", preRegistrationController.createPreRegistration);
router.get("/", preRegistrationController.getAllPreRegistration);
router.get("/:id", preRegistrationController.getPreRegistrationById);


module.exports = router;