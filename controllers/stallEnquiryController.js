const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");

const { StallEnquiry } = db;


exports.createStallEnquiry = async (req, res) => {
    try {
        const { shop_name, person_name, email, phone, category } = req.body;
        if (!shop_name || !person_name || !email || !phone || !category) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required"
            });
        }

        const newStallEnquiry = await StallEnquiry.create({
            shop_name,
            person_name,
            email,
            phone,
            category,
            status: "pending"
        });

        res.status(201).json({
            status: "success",
            message: "Enquiry Posted successfully",
            newStallEnquiry
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create enquiry",
            error: error.message
        });
    }
};


exports.getStallEnquiries = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let where = {};

        if (req.query.search) {
            const searchValue = `%${req.query.search}%`;
            where = {
                [Op.or]: [
                    { shop_name: { [Op.like]: searchValue } },
                    { person_name: { [Op.like]: searchValue } },
                    { email: { [Op.like]: searchValue } },
                    { phone: { [Op.like]: searchValue } }
                ]
            };
        }

        const result = await pagination(StallEnquiry, {
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


exports.getStallEnquryById = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await StallEnquiry.findByPk(id);

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
        const enquiry = await StallEnquiry.findByPk(id);
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