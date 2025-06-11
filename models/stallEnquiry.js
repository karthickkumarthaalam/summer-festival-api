module.exports = (sequelize, DataTypes) => {
    const StallEnquiry = sequelize.define("StallEnquiry", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shop_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        person_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("pending", "resolved", "closed"),
            allowNull: false,
            defaultValue: "pending",
        }
    });


    return StallEnquiry;
};