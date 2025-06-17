module.exports = (sequelize, DataTypes) => {
    const OtpVerification = sequelize.define("OtpVerification", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        timestamps: false,
    });

    return OtpVerification;
};