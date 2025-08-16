const db = require("../models");
const fs = require("fs/promises");
const { Op } = require("sequelize");
const { sendRefundEnquiryEmail } = require("../utils/sendEmail");
const { uploadToCpanel } = require("../utils/uploadToCpanel");
const { RefundEnquiry, Attendee } = db;
const pagination = require("../utils/pagination");


exports.createRefundEnquiry = async (req, res) => {
    const billFile = req.file || null;
    const billsPath = billFile ? billFile.path : null;

    try {
        const {
            ORDER_ID,
            NAME,
            EMAIL_ID,
            PHONE_NUMBER,
            REFUND_OR_CONTINUE,
            PAYMENT_MODE,
            TWINT_ACCOUNT,
            BANK_NAME,
            IBAN_NUMBER,
            BIC_SWIFT_CODE,
            FULL_NAME,
            TICKET_DESCRIPTION
        } = req.body;

        if (!ORDER_ID || !NAME || !EMAIL_ID || !PHONE_NUMBER || !REFUND_OR_CONTINUE) {
            return res.status(400).json({
                status: "error",
                message: "ORDER_ID, NAME, EMAIL_ID, PHONE_NUMBER, and REFUND_OR_CONTINUE are required"
            });
        }

        const existingEnquiry = await RefundEnquiry.findOne({ where: { ORDER_ID } });

        if (existingEnquiry) {
            return res.status(400).json({
                status: "error",
                message: "Refund enquiry already exists for this Order ID"
            });
        }

        let uploadedUrl = null;

        if (billFile) {
            uploadedUrl = await uploadToCpanel(
                billsPath,
                "summerfestival/bills",
                billFile.originalname
            );
        }


        const refundEnquiry = await RefundEnquiry.create({
            ORDER_ID,
            NAME,
            EMAIL_ID,
            PHONE_NUMBER,
            REFUND_OR_CONTINUE,
            PAYMENT_MODE,
            TWINT_ACCOUNT,
            BANK_NAME,
            IBAN_NUMBER,
            BIC_SWIFT_CODE,
            FULL_NAME,
            TICKET_DESCRIPTION,
            REFUNDED_STATUS: "pending",
            BILL_ATTACHMENT: uploadedUrl
        });

        if (billsPath) await fs.unlink(billsPath).catch(() => { });

        await sendRefundEnquiryEmail(
            EMAIL_ID,
            NAME,
            "Refund Enquiry Received",
            `Your refund enquiry for ORDER ID: ${ORDER_ID} has been received. We will get back to you shortly.`
        );

        return res.status(201).json({
            status: "success",
            message: "Refund enquiry created successfully",
            refundEnquiry
        });

    } catch (error) {
        if (billsPath) {
            await fs.unlink(billsPath).catch(() => { });
        }
        return res.status(500).json({
            status: "error",
            message: "Failed to create refund enquiry",
            error: error.message
        });
    }
};



exports.checkAttendeesOrderId = async (req, res) => {
    const { ORDER_ID } = req.params;

    try {
        if (!ORDER_ID) {
            return res.status(400).json({ status: "error", message: "Order ID is required" });
        }

        const attendee = await Attendee.findOne({
            where: {
                ORDER_ID
            }
        });

        if (!attendee) {
            return res.status(404).json({ status: "error", message: "Invalid Order ID" });
        }


        const existingEnquiry = await RefundEnquiry.findOne({ where: { ORDER_ID } });

        if (existingEnquiry) {
            return res.status(400).json({
                status: "error",
                message: "Refund enquiry already exists for this Order ID"
            });
        }

        return res.status(200).json({ status: "success", message: "Valid Order Id", attendee, valid: true });

    } catch (error) {
        return res.status(500).json({ Status: "error", message: "Failed to check attendee order ID", error: error.message });
    }
};

exports.getAllRefundEnquiries = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let whereCondition = {};

        if (req.query.search) {
            const searchValue = `%${req.query.search}%`;
            whereCondition = {
                [Op.or]: [
                    { ORDER_ID: { [Op.like]: searchValue } },
                    { NAME: { [Op.like]: searchValue } },
                    { EMAIL_ID: { [Op.like]: searchValue } },
                ]
            };
        }

        if (req.query.status) {
            whereCondition.REFUNDED_STATUS = req.query.status;
        }

        const result = await pagination(RefundEnquiry, {
            page,
            limit,
            where: whereCondition,
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ status: "success", message: "Refund enquirires fetched successfully", data: result.data, pagination: result.pagination });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Failed to fetch refund enquiries", error: error.message });
    }
};


exports.updateRefundStatus = async (req, res) => {
    const { id } = req.params;

    try {

        const { REFUNDED_STATUS } = req.body;

        const refundEnquiry = await RefundEnquiry.findByPk(id);

        if (!refundEnquiry) {
            return res.status(404).json({ status: "error", message: "Refund enquiry not found" });
        }

        if (!["pending", "verified", "refunded"].includes(REFUNDED_STATUS)) {
            return res.status(400).json({ status: "error", message: "Invalid REFUNDED_STATUS value" });
        }

        refundEnquiry.REFUNDED_STATUS = REFUNDED_STATUS;
        await refundEnquiry.save();

        return res.status(200).json({ status: "success", message: "Refund status updated successfully", refundEnquiry });

    } catch (error) {
        return res.status(500).json({ status: "error", message: "Failed to update refund status", error: error.message });
    }
};


exports.getAttendeeByOrderId = async (req, res) => {
    const { ORDER_ID } = req.params;

    try {
        const attendees = await Attendee.findAll({
            where: {
                ORDER_ID
            }
        });

        if (!attendees) {
            return res.status(404).json({ status: "error", message: "Attendee not found with the provided ORDER_ID" });
        }

        return res.status(200).json({ status: "success", message: "Attendee found", attendees });

    } catch (error) {
        return res.status(500).json({ status: "error", message: "Failed to fetch attendee by ORDER_ID", error: error.message });
    }
};