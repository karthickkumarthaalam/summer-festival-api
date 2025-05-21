const { Sequelize } = require("sequelize");
const config = require("../config/db");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false,
    }
);


sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.error('error: ' + err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Artist = require("./artist")(sequelize, Sequelize);
db.Banner = require("./banner")(sequelize, Sequelize);
db.TopEventOffers = require("./topEventOffers")(sequelize, Sequelize);
db.News = require("./news")(sequelize, Sequelize);
db.ContactUs = require("./contactUs")(sequelize, Sequelize);
db.ShowLineup = require("./showLineUp")(sequelize, Sequelize);
db.Show = require("./shows")(sequelize, Sequelize);
db.ShowArtist = require("./showArtist")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


module.exports = db;