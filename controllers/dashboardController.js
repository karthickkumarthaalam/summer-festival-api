const db = require("../models");
const { News, Artist, Banner } = db;


exports.getDashboardDetails = async (req, res) => {
    try {
        const [artistsCount, newsCount, bannersCount] = await Promise.all([
            Artist.count({ where: { status: "active" } }),
            News.count({ where: { status: "active" } }),
            Banner.count({ where: { status: "active" } }),
        ]);

        res.json({
            status: "success",
            data: {
                artists: artistsCount,
                news: newsCount,
                banners: bannersCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch dashboard counts",
        });
    }
};