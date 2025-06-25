const db = require("../models");
const fs = require("fs");
const pagination = require("../utils/pagination");
const { Op, literal } = require("sequelize");

const { News } = db;

exports.createNews = async (req, res) => {
    try {
        const { title, category, description, published, author, status, language } = req.body;
        const image_url = req.file?.path;

        if (!title || !category || !description || !author) {
            return res.status(400).json({ status: "error", message: "Title, Category, Description and Author are required" });
        }

        let parsedLanguage = ["All"];
        if (language) {
            parsedLanguage = JSON.parse(language);
        }

        let publishedDate = null;
        if (published) {
            const date = new Date(published);
            publishedDate = date;
        }

        const news = await News.create({
            title,
            category,
            description,
            published: published || "draft",
            author,
            image: image_url,
            status: status || "active",
            language: parsedLanguage
        });

        res.status(201).json({ status: "success", message: "News created successfully", news });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to create news", error: error.message });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let where = {};

        if (req.query.search) {
            where.title = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        if (req.query.category) {
            where.category = {
                [Op.like]: `%${req.query.category}%`
            };
        }

        if (req.query.exclude) {
            where.id = { [Op.ne]: req.query.exclude };
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

        const result = await pagination(News, {
            page,
            limit,
            where
        });

        res.status(200).json({ status: "success", message: "News fetched successfully", data: result });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch news", error: error.message });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findByPk(id);

        if (!news) {
            return res.status(404).json({ status: "error", message: "News not found" });
        }

        res.status(200).json({ status: "success", message: "News fetched successfully", news });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch news", error: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ status: "error", message: "News not found" });
        }

        const { title, category, description, published, author, status, language } = req.body;

        if (req.file) {
            if (news.image && fs.existsSync(news.image)) {
                fs.unlinkSync(news.image);
            }
            news.image = req.file.path;
        }

        news.title = title || news.title;
        news.category = category || news.category;
        news.description = description || news.description;
        news.author = author || news.author;
        news.status = status || news.status;

        if (published !== undefined) {
            const date = new Date(published);
            news.published = date;
        }

        if (language !== undefined) {
            news.language = JSON.parse(language);
        }

        await news.save();
        res.status(200).json({ status: "success", message: "News updated successfully", news });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update news", error: error.message });
    }
};

exports.updateNewsStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ status: "error", message: "Status is required" });
        }

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ status: "error", message: "News not found" });
        }

        news.status = status;
        await news.save();

        res.status(200).json({ status: "success", message: "News status updated successfully", news });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update news status", error: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByPk(id);

        if (!news) {
            return res.status(404).json({ status: "error", message: "News not found" });
        }

        // Delete image file if exists
        if (news.image && fs.existsSync(news.image)) {
            fs.unlinkSync(news.image);
        }

        await news.destroy();

        res.status(200).json({ status: "success", message: "News deleted successfully" });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete news", error: error.message });
    }
};
