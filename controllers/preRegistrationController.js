const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");

const { PreRegistration } = db;

exports.createPreRegistration = async (req, res) => {
    try {
        const { name, email, phone, country } = req.body;

        if (!name || !email || !phone || !country) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const newPreRegistration = await PreRegistration.create({
            name,
            email,
            phone,
            country
        });

        res.status(201).json({
            status: "success",
            message: "Pre-Registration created successfully",
            newPreRegistration
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to Create Pre-Registration"
        });
    }
};


exports.getAllPreRegistration = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let where = {};

        if (req.query.search) {
            const searchValue = `%${req.query.search}%`;
            where = {
                [Op.or]: [
                    { name: { [Op.like]: searchValue } },
                    { email: { [Op.like]: searchValue } },
                    { phone: { [Op.like]: searchValue } },
                ]
            };
        }

        const result = await pagination(PreRegistration, {
            page,
            limit,
            where
        });

        res.status(200).json({
            status: "success",
            message: "Pre-Registration fetched successfully",
            data: result
        });


    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch pre-registration",
            error: error.message
        });
    }
};


exports.getPreRegistrationById = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await PreRegistration.findByPk(id);

        if (!registration) {
            return res.status(404).json({
                status: "error",
                message: "Registration not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Registration fetched successfully",
            registration
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch registration",
            error: error.message
        });
    }
};