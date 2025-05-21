module.exports = (sequelize, DataTypes) => {
    const ShowLineup = sequelize.define("ShowLineup", {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
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
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active"
        }
    });

    ShowLineup.associate = (models) => {
        ShowLineup.hasMany(models.Show, { foreignKey: "lineup_id", as: "shows" });
    };

    return ShowLineup;
};
