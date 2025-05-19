const db = require("../models");
const pagination = require("../utils/pagination");
const { Op, literal } = require("sequelize");
const { TopEventOffers } = db;


exports.createOffers = async (req, res) => {

    const { title, redirect_url, language } = req.body;

    try {
        if (!title || !redirect_url) {
            return res.status(400).json({ status: "error", message: "Required all fields" });
        }

        const eventOffer = await TopEventOffers.create({
            title,
            redirect_url,
            language,
            status: "active"
        });

        res.status(201).json({ status: "success", message: "Top event offer created successfully", eventOffer });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create Top event offer", error: error.message });
    }
};


exports.getAllOffers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        let where = {};

        if (req.query.status) {
            where.status = req.query.status;
        }

        if (req.query.search) {
            where.title = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        if (req.query.language) {
            where = {
                ...where,
                [Op.and]: literal(`JSON_CONTAINS(language, '["${req.query.language}"]')`)
            };
        }

        const result = await pagination(TopEventOffers, {
            page,
            limit,
            where
        });

        res.status(200).json({
            status: "success",
            message: "offer details fetched successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch top event offers", error: error.message });
    }
};

exports.getOfferById = async (req, res) => {
    const { id } = req.params;
    try {

        const offerDetail = await TopEventOffers.findByPk(id);

        if (!offerDetail) {
            return res.status(404).json({ status: "error", message: "No offer details available" });
        }

        res.status(200).json({ status: "success", message: "Offer fetched successfully", offerDetail });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch offer details", error: error.message });
    }
};


exports.updateOffer = async (req, res) => {
    const { id } = req.params;
    try {
        const offerDetail = await TopEventOffers.findByPk(id);
        if (!offerDetail) {
            return res.status(404).json({ status: "error", message: "No offer Details available" });
        }
        const { title, redirect_url, status, language } = req.body;

        offerDetail.title = title || offerDetail.title;
        offerDetail.redirect_url = redirect_url || offerDetail.redirect_url;
        offerDetail.status = status || offerDetail.status;

        if (language !== undefined) {
            offerDetail.language = language;
        }

        await offerDetail.save();

        res.status(200).json({ status: "success", message: "Top Event offer updated successfully", offerDetail });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update offer detail", error: error.message });
    }
};

exports.updateOfferStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const offerDetail = await TopEventOffers.findByPk(id);
        if (!offerDetail) {
            return res.status(404).json({ status: "error", message: "No offer Details available" });
        }
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ status: "error", message: "Status is required" });
        }

        offerDetail.status = status;
        await offerDetail.save();
        res.status(200).json({ status: "success", message: "Offer Status updated successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update offer detail", error: error.message });
    }
};


exports.deleteOffer = async (req, res) => {
    const { id } = req.params;
    try {
        const offerDetail = await TopEventOffers.findByPk(id);

        if (!offerDetail) {
            return res.status(404).json({ status: "error", message: "No offer Details available" });
        }

        await offerDetail.destroy();

        res.status(200).json({ status: "success", message: "Offer Deleted  successfully" });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete offer detail status", error: error.message });
    }
};