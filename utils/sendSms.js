const axios = require("axios");

const BULKSMS_USERNAME = process.env.BULKSMS_USERNAME;
const BULKSMS_PASSWORD = process.env.BULKSMS_PASSWORD;

const sendSms = async (phone, message, maxAttempts = 3) => {
    const cleanedPhone = phone.replace(/\s/g, '');
    const payload = [
        {
            to: cleanedPhone,
            body: message
        }
    ];

    let attempts = 0;
    let lastError = null;

    while (attempts < maxAttempts) {
        try {
            const response = await axios.post(process.env.BULKSMS_API_URL, payload, {
                auth: {
                    username: BULKSMS_USERNAME,
                    password: BULKSMS_PASSWORD
                },
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 5000
            });

            return { success: true, response: response.data };

        } catch (error) {
            attempts++;
            lastError = error;

            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    return {
        success: false,
        error: lastError ? (lastError.response ? lastError.response.data : lastError.message) : 'Unknown error'
    };
};

module.exports = sendSms;
