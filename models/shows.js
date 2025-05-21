module.exports = (sequelize, DataTypes) => {
    const Show = sequelize.define("Show", {
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        location: {
            type: DataTypes.STRING,
        },
        lineup_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Show.associate = (models) => {
        Show.belongsTo(models.ShowLineup, { foreignKey: "lineup_id" });
        Show.hasMany(models.ShowArtist, { foreignKey: "show_id", as: "artists" });
    };

    return Show;
};
