const db = require("../models");
const pagination = require("../utils/pagination");
const { Op, literal } = require("sequelize");

const { ShowLineup, Show, ShowArtist } = db;

exports.createShowLineUp = async (req, res) => {
    try {

        const { date, language, status } = req.body;

        if (!date) {
            return res.status(400).json({ status: "error", message: "Date is required" });
        }

        const newLineup = await ShowLineup.create({
            date,
            language: language || ["All"],
            status: status || "active",
        });

        res.status(201).json({ status: "success", message: "Show Lineup created", data: newLineup });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create show Lineup", error: error.message });
    }
};


exports.getShowLineups = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let where = {};

        if (req.query.status) {
            where.status = req.query.status;
        }

        if (req.query.language) {
            where = {
                ...where,
                [Op.and]: literal(`JSON_CONTAINS(language, '["${req.query.language}"]')`)
            };
        }

        const result = await pagination(ShowLineup, {
            page,
            limit,
            where
        });

        res.status(200).json({
            status: "success",
            message: "ShowLineUp fetched successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "failed to fetch showlineups" });
    }
};

exports.getShowLineupById = async (req, res) => {
    try {
        const { id } = req.params;

        const lineup = await ShowLineup.findOne({
            where: { id },
            include: [
                {
                    model: Show,
                    as: "shows",
                    include: [
                        {
                            model: ShowArtist,
                            as: "artists",
                        },
                    ],
                },
            ],
        });

        if (!lineup) {
            return res.status(404).json({ status: "error", message: "Show lineup not found" });
        }

        res.status(200).json({ status: "success", data: lineup });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while fetching show lineup" });
    }
};

exports.updateShowLineup = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, language, status } = req.body;

        const lineup = await ShowLineup.findByPk(id);

        if (!lineup) {
            return res.status(404).json({ error: "error", message: "Show lineup not found" });
        }

        await lineup.update({
            date: date || lineup.date,
            language: language || lineup.language,
            status: status || lineup.status,
        });

        res.status(200).json({ status: "success", message: "Show lineup updated successfully", data: lineup });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while updating show lineup" });
    }
};

exports.updateShowLineupStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lineup = await ShowLineup.findByPk(id);

        if (!lineup) {
            return res.status(404).json({ status: "error", message: "Show lineup not found" });
        }

        await lineup.update({ status });

        res.status(200).json({ status: "success", message: "Show lineup status updated successfully", data: lineup });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while updating show lineup status" });
    }
};

exports.deleteShowLineup = async (req, res) => {
    try {
        const { id } = req.params;

        const lineup = await ShowLineup.findByPk(id);

        if (!lineup) {
            return res.status(404).json({ status: "error", message: "Show lineup not found" });
        }

        await lineup.destroy();

        res.status(200).json({ status: "success", message: "Show lineup deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error while deleting show lineup" });
    }
};


