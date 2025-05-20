

module.exports = (sequelize, DataTypes) => {

    const ContactUs = sequelize.define("ContactUs", {
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        marketing_mobile_numbers: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        enquiry_mobile_numbers: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        marketing_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ticket_enquiry_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        event_enquiry_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedIn_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instagram_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        facebook_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pinterest_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: "contact_us",
    });

    return ContactUs;
};

