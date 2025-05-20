module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define("News", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        published: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
        },
        language: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: ["All"]
        }
    });

    return News;
};
