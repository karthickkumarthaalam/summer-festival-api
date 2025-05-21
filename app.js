const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
const cookieParser = require("cookie-parser");
require('dotenv').config();


const app = express();


app.use(cors({
    origin: process.env.CLIENT_LINK,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["content-type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
    db.sequelize.sync().then(() => {
        console.log("Database synchronized (alter mode)");
    });
}

const dashboardRoutes = require("./routes/dashboardRoutes");
const useRoutes = require("./routes/userRoutes");
const artistRoutes = require("./routes/artistRoutes");
const topEventOfferRoutes = require("./routes/topEventOffersRouters");
const bannerRoutes = require("./routes/bannerRoutes");
const newsRoutes = require("./routes/newsRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const showLineUpRoutes = require("./routes/showLineupRoutes");
const showRoutes = require("./routes/showRoutes");
const showArtistRoutes = require("./routes/showArtistsRoutes");


app.use("/summer-festival/api/dashboard", dashboardRoutes);
app.use("/summer-festival/api/auth", useRoutes);
app.use("/summer-festival/api/artist", artistRoutes);
app.use("/summer-festival/api/top-event-offers", topEventOfferRoutes);
app.use("/summer-festival/api/banner", bannerRoutes);
app.use("/summer-festival/api/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/summer-festival/api/news", newsRoutes);
app.use("/summer-festival/api/contactus", contactUsRoutes);
app.use("/summer-festival/api/showlineup", showLineUpRoutes);
app.use("/summer-festival/api/shows", showRoutes);
app.use("/summer-festival/api/show-artist", showArtistRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});