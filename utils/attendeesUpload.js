// scripts/importAttendees.js
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../models");
const Attendee = db.Attendee;

module.exports = async function importAttendees() {
    try {
        const count = await Attendee.count();
        if (count > 0) {
            console.log("📌 Attendees table already has data. Skipping import.");
            return;
        }

        console.log("📂 Reading CSV file...");
        const results = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream("attendees.csv")
                .pipe(csv())
                .on("data", (row) => {
                    results.push({
                        ORDER_ID: row.ORDER_ID,
                        TICKET_ID: row.TICKET_ID,
                        TICKET_CLASS: row.TICKET_CLASS,
                        FIRST_NAME: row.FIRST_NAME,
                        EMAIL: row.EMAIL,
                        MOBILE_NO: row.MOBILE_NO,
                        COUNTRY: row.COUNTRY,
                        AMOUNT_COLLECTED: row.AMOUNT_COLLECTED,
                        PURCHASED_DATE: row.PURCHASED_ON,
                        ORDER_TIME: row.ORDER_TIME,
                        PAYMENT_MODE: row.PAYMENT_MODE,
                        PAYMENT_STATUS: row.PAYMENT_STATUS,
                        PAYMENT_GATEWAY: row.PAYMENT_GATEWAY,
                        GATEWAY_TRANSACTION_ID: row.GATEWAY_TRANSACTION_ID,
                    });
                })
                .on("end", resolve)
                .on("error", reject);
        });

        if (results.length > 0) {
            await Attendee.bulkCreate(results);
            console.log(`✅ Imported ${results.length} attendees successfully!`);
        } else {
            console.log("⚠️ No data found in CSV.");
        }
    } catch (err) {
        console.error("❌ Error importing attendees:", err);
    }
};
