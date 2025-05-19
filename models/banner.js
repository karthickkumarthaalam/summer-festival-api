module.exports = (sequelize, DataTypes) => {
    const Banner = sequelize.define("Banner", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
            allowNull: false,
        },
        language: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: ["All"]
        }
    });

    return Banner;
};