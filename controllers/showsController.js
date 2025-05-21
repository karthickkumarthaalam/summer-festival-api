const db = require("../models");
const { Op } = require("sequelize");
const pagination = require("../utils/pagination");

const { Show, ShowLineup, ShowArtist } = db;

exports.createShow = async (req, res) => {
    try {
        const { time, title, description, location, lineup_id } = req.body;

        if (!time || !title || !lineup_id) {
            return res.status(400).json({ status: "error", message: "Time, title, and lineup_id are required" });
        }

        const newShow = await Show.create({
            time,
            title,
            description,
            location,
            lineup_id
        });

        res.status(201).json({ status: "success", message: "Show created successfully", data: newShow });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create show", error: error.message });
    }
};

exports.getShows = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const where = {};

        if (req.query.lineup_id) {
            where.lineup_id = req.query.lineup_id;
        }

        if (req.query.search) {
            where.title = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        const result = await pagination(Show, {
            page,
            limit,
            where,
            include: [
                {
                    model: ShowLineup,
                    attributes: ["id", "date"],
                },
                {
                    model: ShowArtist,
                    as: "artists",
                }
            ]
        });

        res.status(200).json({ status: "success", message: "Shows fetched successfully", data: result });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch shows", error: error.message });
    }
};

exports.getShowById = async (req, res) => {
    try {
        const { id } = req.params;

        const show = await Show.findOne({
            where: { id },
            include: [
                {
                    model: ShowLineup,
                    attributes: ["id", "date"],
                },
                {
                    model: ShowArtist,
                    as: "artists",
                }
            ]
        });

        if (!show) {
            return res.status(404).json({ status: "error", message: "Show not found" });
        }

        res.status(200).json({ status: "success", data: show });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while fetching show", error: error.message });
    }
};

exports.updateShow = async (req, res) => {
    try {
        const { id } = req.params;
        const { time, title, description, location, lineup_id } = req.body;

        const show = await Show.findByPk(id);

        if (!show) {
            return res.status(404).json({ status: "error", message: "Show not found" });
        }

        await show.update({
            time: time !== undefined ? time : show.time,
            title: title !== undefined ? title : show.title,
            description: description !== undefined ? description : show.description,
            location: location !== undefined ? location : show.location,
            lineup_id: lineup_id !== undefined ? lineup_id : show.lineup_id
        });

        res.status(200).json({ status: "success", message: "Show updated successfully", data: show });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update show", error: error.message });
    }
};

exports.deleteShow = async (req, res) => {
    try {
        const { id } = req.params;

        const show = await Show.findByPk(id);

        if (!show) {
            return res.status(404).json({ status: "error", message: "Show not found" });
        }

        await show.destroy();

        res.status(200).json({ status: "success", message: "Show deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete show", error: error.message });
    }
};
