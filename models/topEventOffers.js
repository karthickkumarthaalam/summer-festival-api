
module.exports = (sequelize, DataTypes) => {
    const TopEventOffers = sequelize.define("TopEventOffers", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        redirect_url: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active"
        },
        language: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: ["All"]
        }
    });

    return TopEventOffers;
};