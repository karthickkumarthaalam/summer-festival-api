module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define("Artist", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        artist_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
        },
        facebook_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        instagram_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        pinterest_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        twitter_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        linkedin_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        language: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '["All"]',
            get() {
                const value = this.getDataValue('language');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('language', JSON.stringify(value));
            }
        }
    });

    return Artist;
}

