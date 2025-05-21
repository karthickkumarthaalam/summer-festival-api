

module.exports = (sequelize, DataTypes) => {

    const ContactUs = sequelize.define("ContactUs", {
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        marketing_mobile_numbers: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('marketing_mobile_numbers');
                if (!value) return null;
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }
                return value;
            },
            set(value) {
                this.setDataValue('marketing_mobile_numbers', JSON.stringify(value));
            }
        },
        enquiry_mobile_numbers: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('enquiry_mobile_numbers');
                if (!value) return null;
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }
                return value;
            },
            set(value) {
                this.setDataValue('enquiry_mobile_numbers', JSON.stringify(value));
            }
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
        },
        tiktok_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: "contact_us",
    });

    return ContactUs;
};

