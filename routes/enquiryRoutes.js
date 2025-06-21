const express = require('express');
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");


router.post("/", enquiryController.createEnquiry);
router.get("/", enquiryController.getEnquiries);
router.get("/export", enquiryController.exportEnquiries);
router.get("/:id", enquiryController.getEnquryById);
router.patch("/:id", enquiryController.updateStatus);


module.exports = router;