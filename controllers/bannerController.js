const fs = require("fs");
const db = require("../models");
const pagination = require("../utils/pagination");
const { Op, literal } = require("sequelize");

const { Banner } = db;

exports.createBanner = async (req, res) => {
    try {
        const { title, status, language } = req.body;
        const image = req.file?.path;

        if (!title || !image) {
            return res.status(400).json({ status: "error", message: "All fields are required." });
        }

        let parsedLanguage = ["All"];

        if (language) {
            parsedLanguage = JSON.parse(language);
        }

        const banner = await Banner.create({
            title,
            image,
            language: parsedLanguage,
            status: status || "active"
        });

        return res.status(201).json({ status: "success", message: "Banner created successfully.", banner });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create banner.", error: error.message });
    }
};

exports.getAllBanner = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let where = {};
        if (req.query.status) where.status = req.query.status;
        if (req.query.search) {
            where.title = { [Op.like]: `%${req.query.search}%` };
        }

        if (req.query.language) {
            where = {
                ...where,
                [Op.and]: literal(`JSON_CONTAINS(language, '["${req.query.language}"]')`)
            };
        }

        const result = await pagination(Banner, { page, limit, where });

        return res.status(200).json({
            status: "success",
            message: "Banners fetched successfully.",
            data: result
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch banners.", error: error.message });
    }
};

exports.getBannerById = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).json({ status: "error", message: "Banner not found." });
        }

        return res.status(200).json({ status: "success", message: "Banner fetched successfully.", banner });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch banner.", error: error.message });
    }
};

exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).json({ status: "error", message: "Banner not found." });
        }

        const { title, status, language } = req.body;

        if (req.file) {
            if (fs.existsSync(banner.image)) {
                fs.unlinkSync(banner.image);
            }

            banner.image = req.file.path;
        }

        banner.title = title || banner.title;
        banner.status = status || banner.status;

        if (language !== undefined) {
            banner.language = JSON.parse(language);
        }

        await banner.save();

        return res.status(200).json({ status: "success", message: "Banner updated successfully.", banner });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update banner.", error: error.message });
    }
};

exports.updateBannerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).json({ status: "error", message: "Banner not found." });
        }

        if (!status) {
            return res.status(400).json({ status: "error", message: "Status is required." });
        }

        banner.status = status;
        await banner.save();

        return res.status(200).json({ status: "success", message: "Banner status updated successfully.", banner });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update banner status.", error: error.message });
    }
};

exports.deleteBanner = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).json({ status: "error", message: "Banner not found." });
        }

        if (fs.existsSync(banner.image)) {
            fs.unlinkSync(banner.image);
        }

        await banner.destroy();

        return res.status(200).json({ status: "success", message: "Banner deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete banner.", error: error.message });
    }
};
