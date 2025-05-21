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

    return Banner;
};