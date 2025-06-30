const express = require('express');
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");
const enquiryReplyController = require("../controllers/enquiryReplyController");


router.post("/", enquiryController.createEnquiry);
router.get("/", enquiryController.getEnquiries);

router.get("/export", enquiryController.exportEnquiries);
router.post("/:id/reply", enquiryReplyController.addReply);
router.post("/:id/comment", enquiryController.updateComment);

router.get("/:id", enquiryController.getEnquryById);
router.patch("/:id", enquiryController.updateStatus);


module.exports = router;