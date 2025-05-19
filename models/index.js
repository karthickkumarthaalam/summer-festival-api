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
db.Artist = require("./artist")(sequelize, Sequelize); 4;
db.Banner = require("./banner")(sequelize, Sequelize);
db.TopEventOffers = require("./topEventOffers")(sequelize, Sequelize);


module.exports = db;