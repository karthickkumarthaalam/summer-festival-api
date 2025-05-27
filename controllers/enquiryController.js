const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");

const { Enquiry } = db;

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
            where.name = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        const result = await pagination(Enquiry, {
            page,
            limit,
            where
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

        const enquiry = await Enquiry.findByPk(id);

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