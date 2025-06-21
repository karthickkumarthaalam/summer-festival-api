const ExcelJS = require("exceljs");


const exportExcelFile = async (res, options) => {
    const { fileName, sheetName, columns, records } = options;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName || "Sheet 1");

    worksheet.columns = columns;

    if (records.length > 0) {
        records.forEach((record) => {
            worksheet.addRow(record);
        });
    } else {
        for (let i = 0; i < 5; i++) {
            worksheet.addRow({});
        }
    }

    worksheet.columns.forEach((column) => {
        let maxLength = 12;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 0;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength + 2;
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.status(200).end();

};

module.exports = exportExcelFile;