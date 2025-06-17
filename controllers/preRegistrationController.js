const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");
const sendSms = require("../utils/sendSms");

const { PreRegistration, OtpVerification } = db;

exports.sendOtp = async (req, res) => {
    try {
        const { name, email, phone, country } = req.body;

        if (!name || !email || !phone || !country) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const existingRegistration = await PreRegistration.findOne({
            where: {
                [Op.or]: {
                    email: email,
                    phone: phone
                }
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                status: "error",
                message: "Pre-Registration with this email or phone already exists"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const message = `Your OTP for Thaalam Summer festival Pre-Registration is: ${otp}`;

        const smsResult = await sendSms(phone, message);

        if (!smsResult.success) {
            return res.status(500).json({ status: "error", message: "Failed to send OTP via SMS" });
        }

        await OtpVerification.destroy({ where: { phone } });

        await OtpVerification.create({ phone, otp });

        res.status(200).json({
            status: "success",
            message: `OTP sent to ${phone}`
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to send OTP"
        });
    }
};

exports.createPreRegistration = async (req, res) => {
    try {
        const { name, email, phone, country, otp } = req.body;

        if (!name || !email || !phone || !country || !otp) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        const existingRegistration = await PreRegistration.findOne({
            where: {
                [Op.or]: {
                    email: email,
                    phone: phone
                }
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                status: "error",
                message: "Pre-Registration with this email or phone already exists"
            });
        }

        const otpRecord = await OtpVerification.findOne({
            where: { phone, otp }
        });

        if (!otpRecord) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired OTP"
            });
        }

        const newPreRegistration = await PreRegistration.create({
            name,
            email,
            phone,
            country
        });

        await OtpVerification.destroy({ where: { phone } });

        const message = "Thank you for Pre-Registering for Thaalam Summer Festival! We will keep you updated with the latest information.";
        await sendSms(phone, message);

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