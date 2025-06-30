const db = require("../models");
const { EnquiryReply, Enquiry } = db;
const { sendEnquiryReplyEmail } = require("../utils/sendEmail");

exports.addReply = async (req, res) => {
    const { id } = req.params;
    try {
        const { reply_message } = req.body;

        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        const reply = await EnquiryReply.create({
            enquiry_id: enquiry.id,
            reply_message,
        });

        await sendEnquiryReplyEmail(
            enquiry.email,
            enquiry.name,
            `Reply to your enquiry - ${enquiry.subject}`,
            reply_message
        );

        res.status(200).json({
            message: "Reply sent and saved successfully",
            reply,
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to reply", error: error.message });
    }
};