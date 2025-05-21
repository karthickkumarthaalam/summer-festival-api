const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");
const fs = require("fs");

const { ShowArtist, Show } = db;

exports.createShowArtist = async (req, res) => {
    try {
        const { name, role, website_url, instagram_url, facebook_url, other_url, show_id } = req.body;

        const image_url = req.file?.path;

        if (!name || !show_id) {
            return res.status(400).json({ status: "error", message: "Name and show_id are required" });
        }

        const newArtist = await ShowArtist.create({
            image: image_url,
            name,
            role,
            website_url,
            instagram_url,
            facebook_url,
            other_url,
            show_id
        });

        res.status(201).json({ status: "success", message: "Show artist created successfully", data: newArtist });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create show artist", error: error.message });
    }
};

exports.getShowArtists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const where = {};

        if (req.query.show_id) {
            where.show_id = req.query.show_id;
        }

        if (req.query.search) {
            where.name = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        const result = await pagination(ShowArtist, {
            page,
            limit,
            where,
            include: [
                {
                    model: Show,
                    attributes: ["id", "title"],
                }
            ]
        });

        res.status(200).json({ status: "success", message: "Show artists fetched successfully", data: result });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch show artists", error: error.message });
    }
};

exports.getShowArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await ShowArtist.findOne({
            where: { id },
            include: [
                {
                    model: Show,
                    attributes: ["id", "title"],
                }
            ]
        });

        if (!artist) {
            return res.status(404).json({ status: "error", message: "Show artist not found" });
        }

        res.status(200).json({ status: "success", data: artist });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while fetching show artist", error: error.message });
    }
};

exports.updateShowArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, website_url, instagram_url, facebook_url, other_url, show_id } = req.body;

        const artist = await ShowArtist.findByPk(id);

        if (!artist) {
            return res.status(404).json({ status: "error", message: "Show artist not found" });
        }

        if (req.file) {
            if (artist.image && fs.existsSync(artist.image)) {
                fs.unlinkSync(artist.image);
            }
            artist.image = req.file.path;
        }

        artist.name = name || artist.name;
        artist.role = role || artist.role;
        artist.website_url = website_url || artist.website_url;
        artist.instagram_url = instagram_url || artist.instagram_url;
        artist.facebook_url = facebook_url || artist.facebook_url;
        artist.other_url = other_url || artist.other_url;
        artist.show_id = show_id || artist.show_id;

        await artist.save();

        res.status(200).json({ status: "success", message: "Show artist updated successfully", data: artist });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update show artist", error: error.message });
    }
};

exports.deleteShowArtist = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await ShowArtist.findByPk(id);

        if (!artist) {
            return res.status(404).json({ status: "error", message: "Show artist not found" });
        }

        if (artist.image && fs.existsSync(artist.image)) {
            fs.unlinkSync(artist.image);
        }

        await artist.destroy();

        res.status(200).json({ status: "success", message: "Show artist deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete show artist", error: error.message });
    }
};
