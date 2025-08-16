const express = require("express");
const router = express.Router();
const refundEnquiryController = require("../controllers/refundEnquiryController");
const upload = require("../middlewares/uploadPdf");


router.post("/", upload.single("bills"), refundEnquiryController.createRefundEnquiry);
router.get("/:ORDER_ID", refundEnquiryController.checkAttendeesOrderId);
router.get("/", refundEnquiryController.getAllRefundEnquiries);
router.patch("/:id", refundEnquiryController.updateRefundStatus);
router.get("/attendee/:ORDER_ID", refundEnquiryController.getAttendeeByOrderId);


module.exports = router;