module.exports = (Sequelize, DataTypes) => {
    const EnquiryReply = Sequelize.define("EnquiryReply", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enquiry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: {
                model: "Enquiries",
                key: "id"
            }
        },
        reply_message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    EnquiryReply.associate = (models) => {
        EnquiryReply.belongsTo(models.Enquiry, {
            foreignKey: "enquiry_id",
            as: "enquiry"
        });
    };

    return EnquiryReply;
};