const db = require("../models");
const { News, Artist, Banner, ShowLineup } = db;


exports.getDashboardDetails = async (req, res) => {
    try {
        const [artistsCount, newsCount, bannersCount, showLineup] = await Promise.all([
            Artist.count({ where: { status: "active" } }),
            News.count({ where: { status: "active" } }),
            Banner.count({ where: { status: "active" } }),
            ShowLineup.count({ where: { status: "active" } })
        ]);

        res.json({
            status: "success",
            data: {
                artists: artistsCount,
                news: newsCount,
                banners: bannersCount,
                showLineups: showLineup
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch dashboard counts",
        });
    }
};