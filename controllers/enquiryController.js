const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");
const exportExcelFile = require("../utils/exportExcel");

const { Enquiry, EnquiryReply } = db;

exports.createEnquiry = async (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;
        if (!name || !phone || !email || !subject || !message) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required"
            });
        }

        const newEnquiry = await Enquiry.create({
            name,
            phone,
            email,
            subject,
            message,
            status: "pending"
        });

        res.status(201).json({
            status: "success",
            message: "Enquiry Posted successfully",
            newEnquiry
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create enquiry",
            error: error.message
        });
    }
};


exports.getEnquiries = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let where = {};

        if (req.query.search) {
            const searchValue = `%${req.query.search}%`;

            where = {
                [Op.or]: [
                    { name: { [Op.like]: searchValue } },
                    { subject: { [Op.like]: searchValue } },
                    { email: { [Op.like]: searchValue } },
                    { phone: { [Op.like]: searchValue } }
                ]
            };
        }

        const result = await pagination(Enquiry, {
            page,
            limit,
            where,
            include: [
                {
                    model: EnquiryReply,
                    as: "replies"
                }
            ]
        });

        res.status(200).json({
            status: "success",
            message: "Enquiries fetched successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch enquiries",
            error: error.message
        });
    }
};

exports.getEnquryById = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await Enquiry.findByPk(id, {
            include: [
                {
                    model: EnquiryReply,
                    as: "replies"
                }
            ]
        });

        if (!enquiry) {
            return res.status(404).json({
                status: "error",
                message: "Enquiry not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Enquiry fetched successfully",
            enquiry
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch enquiry",
            error: error.message
        });
    }
};


exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !["pending", "resolved", "closed"].includes(status)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid status value"
            });
        }
        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) {
            return res.status(404).json({
                status: "error",
                message: "Enquiry not found"
            });
        }

        enquiry.status = status;

        await enquiry.save();
        res.status(200).json({
            status: "success",
            message: "Enquiry status updated successfully",
            enquiry
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Unable to update enquiry status",
            error: error.message
        });
    }
};


exports.exportEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll();

        const records = enquiries.map((enq, index) => ({
            SI: index + 1,
            Name: enq.name,
            Phone: enq.phone,
            Email: enq.email,
            Subject: enq.subject,
            Message: enq.message,
            Status: enq.status,
            "Created At": enq.createdAt.toLocaleString(),
        }));

        await exportExcelFile(res, {
            fileName: "Enquiries",
            sheetName: "Enquiries",
            columns: [
                { header: "SI", key: "SI" },
                { header: "Name", key: "Name" },
                { header: "Phone", key: "Phone" },
                { header: "Email", key: "Email" },
                { header: "Subject", key: "Subject" },
                { header: "Message", key: "Message" },
                { header: "Status", key: "Status" },
                { header: "Created At", key: "Created At" },
            ],
            records,
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to export Enquiries",
            error: error.message,
        });
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ status: "error", message: "comment is required" });
        }

        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) {
            return res.status(404).json({ status: "error", message: "Enquiry not found" });
        }

        enquiry.comment = comment;

        await enquiry.save();

        return res.status(200).json({
            status: "success",
            message: "comment posted"
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to comment", error: error.message });
    }
};
