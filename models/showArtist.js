module.exports = (sequelize, DataTypes) => {
    const ShowArtist = sequelize.define("ShowArtist", {
        image: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
        },
        website_url: {
            type: DataTypes.STRING,
        },
        instagram_url: {
            type: DataTypes.STRING,
        },
        facebook_url: {
            type: DataTypes.STRING,
        },
        other_url: {
            type: DataTypes.STRING,
        },
        show_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    ShowArtist.associate = (models) => {
        ShowArtist.belongsTo(models.Show, { foreignKey: "show_id" });
    };

    return ShowArtist;
};
