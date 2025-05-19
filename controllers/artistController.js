const db = require("../models");
const fs = require("fs");
const pagination = require("../utils/pagination");
const { Op, literal } = require("sequelize");

const { Artist } = db;

exports.createArtist = async (req, res) => {
    try {
        const { artist_name, description, facebook_url, instagram_url, pinterest_url, twitter_url, linkedin_url, status, language } = req.body;
        const image_url = req.file?.path;

        if (!artist_name || !description || !image_url) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        let parsedLanguage = ["All"];
        if (language) {
            parsedLanguage = JSON.parse(language);
        }

        const artist = await Artist.create({
            artist_name,
            description,
            image: image_url,
            status: status || "active",
            facebook_url,
            instagram_url,
            pinterest_url,
            twitter_url,
            linkedin_url,
            language: parsedLanguage
        });

        res.status(201).json({ status: "success", message: "Artist created successfully", artist });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create artist", error: error.message });
    }
};


exports.getAllArtists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let where = {};

        if (req.query.search) {
            where.artist_name = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        if (req.query.language) {
            where = {
                ...where,
                [Op.and]: literal(`JSON_CONTAINS(language, '["${req.query.language}"]')`)
            };
        }

        if (req.query.status) {
            where.status = req.query.status;
        }

        const result = await pagination(Artist, {
            page,
            limit,
            where
        });

        res.status(200).json({
            status: "success",
            message: "Artists fetched successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch artists", error: error.message });
    }
};


exports.getArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await Artist.findByPk(id);

        if (!artist) {
            return res.status(404).json({ status: "error", message: "Artist not found" });
        }

        res.status(200).json({ status: "success", message: "Artist fetched successfully", artist });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch artist", error: error.message });
    }
};


exports.updateArtist = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await Artist.findByPk(id);
        if (!artist) {
            return res.status(404).json({ status: "error", message: "Artist not found" });
        }

        const { artist_name, description, status, facebook_url, instagram_url, pinterest_url, twitter_url, linkedin_url, language } = req.body;

        if (req.file) {
            if (artist.image && fs.existsSync(artist.image)) {
                fs.unlinkSync(artist.image);
            }
            artist.image = req.file.path;
        }

        artist.artist_name = artist_name || artist.artist_name;
        artist.description = description || artist.description;
        artist.status = status || artist.status;
        artist.facebook_url = facebook_url || artist.facebook_url;
        artist.instagram_url = instagram_url || artist.instagram_url;
        artist.pinterest_url = pinterest_url || artist.pinterest_url;
        artist.twitter_url = twitter_url || artist.twitter_url;
        artist.linkedin_url = linkedin_url || artist.linkedin_url;

        if (language !== undefined) {
            artist.language = JSON.parse(language);
        }

        await artist.save();
        res.status(200).json({ status: "success", message: "Artist updated successfully", artist });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update artist", error: error.message });
    }
};


exports.updateArtistStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ status: "error", message: "Status is required" });
        }

        const artist = await Artist.findByPk(id);
        if (!artist) {
            return res.status(404).json({ status: "error", message: "Artist not found" });
        }

        artist.status = status;
        await artist.save();

        res.status(200).json({ status: "success", message: "Artist status updated successfully", artist });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update artist status", error: error.message });
    }
};


exports.deleteArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByPk(id);

        if (!artist) {
            return res.status(404).json({ status: "error", message: "Artist not found" });
        }

        // Delete image file if exists
        if (artist.image && fs.existsSync(artist.image)) {
            fs.unlinkSync(artist.image);
        }

        await artist.destroy();

        res.status(200).json({ status: "success", message: "Artist deleted successfully" });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete artist", error: error.message });
    }
};
