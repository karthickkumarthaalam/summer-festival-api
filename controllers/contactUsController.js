const db = require("../models");
const { ContactUs } = db;

exports.upsertContactUs = async (req, res) => {
    try {
        const {
            address,
            marketing_mobile_numbers,
            enquiry_mobile_numbers,
            marketing_email,
            ticket_enquiry_email,
            event_enquiry_email,
            linkedIn_url,
            facebook_url,
            instagram_url,
            pinterest_url,
        } = req.body;

        const existingContact = await ContactUs.findOne({ where: { id: 1 } });

        if (existingContact) {
            const updatedContact = await existingContact.update({
                address,
                marketing_mobile_numbers,
                enquiry_mobile_numbers,
                marketing_email,
                ticket_enquiry_email,
                event_enquiry_email,
                linkedIn_url,
                facebook_url,
                instagram_url,
                pinterest_url,
            });

            return res.status(200).json({ status: "success", data: updatedContact });
        } else {
            const newContact = await ContactUs.create({
                id: 1,
                address,
                marketing_mobile_numbers,
                enquiry_mobile_numbers,
                marketing_email,
                ticket_enquiry_email,
                event_enquiry_email,
                linkedIn_url,
                facebook_url,
                instagram_url,
                pinterest_url,
            });

            return res.status(201).json({ status: "success", data: newContact });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


exports.getContactUs = async (req, res) => {
    try {
        const contactDetails = await ContactUs.findOne({ where: { id: 1 } });

        return res.status(200).json({
            status: "success",
            data: contactDetails || null,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};