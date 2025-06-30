module.exports = (sequlize, DataTypes) => {
    const Enquiry = sequlize.define("Enquiry", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "resolved", "closed"),
            allowNull: false,
            defaultValue: "pending",
        }
    });

    Enquiry.associate = (models) => {
        Enquiry.hasMany(models.EnquiryReply, {
            foreignKey: "enquiry_id",
            as: "replies",
            onDelete: "CASCADE"
        });
    };

    return Enquiry;
};