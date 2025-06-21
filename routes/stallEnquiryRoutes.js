const express = require("express");
const router = express.Router();
const stallEnquiryController = require("../controllers/stallEnquiryController");


router.get("/export", stallEnquiryController.exportStallEnquires);
router.post("/", stallEnquiryController.createStallEnquiry);
router.get("/", stallEnquiryController.getStallEnquiries);
router.get("/:id", stallEnquiryController.getStallEnquryById);
router.patch("/:id", stallEnquiryController.updateStatus);

module.exports = router;