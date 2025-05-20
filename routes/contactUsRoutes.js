const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");


router.post("/", contactUsController.upsertContactUs);
router.get("/", contactUsController.getContactUs);

module.exports = router;    