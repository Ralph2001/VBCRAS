import { format } from 'date-fns';
import Excel from 'exceljs'
import { join } from 'path'
const fs = require('fs');

export async function generate_by_month_year(data) {
    const main_data = JSON.parse(data)

    const workbook = new Excel.Workbook()

    // Document Properties
    workbook.creator = 'VBCRAS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet('Report', {
        pageSetup: { paperSize: 5, orientation: 'landscape', fitToPage: true }
    });

    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    const month = main_data.month.toUpperCase()
    const year = main_data.year

    const main_title = main_data.petition_type === 'CCE' ? 'CORRECTION OF CLERICAL ERROR UNDER R.A. 9048 / R.A. 10172' : main_data.petition_type === 'CFN' ? 'CHANGE OF FIRST NAME UNDER R.A. 9048' : '';
    const report_title = `REPORT LIST ${month} ${year}`;

    // Add and format the main title
    const titleRow = worksheet.addRow([main_title]);
    titleRow.font = { size: 11, bold: true };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.height = 25;
    worksheet.mergeCells(`A1:I1`); // Merge cells A1 to I1 for the title

    // Add and format the report title
    const reportRow = worksheet.addRow([report_title]);
    reportRow.font = { size: 11, bold: true };
    reportRow.alignment = { vertical: 'middle', horizontal: 'center' };
    reportRow.height = 25;
    worksheet.mergeCells(`A2:I2`); // Merge cells A2 to I2 for the report title


    const blankRow = worksheet.addRow([]);
    reportRow.font = { size: 11, bold: true };
    reportRow.alignment = { vertical: 'middle', horizontal: 'center' };
    reportRow.height = 25;
    worksheet.mergeCells(`A3:I3`);

    // Define columns starting from the second row
    worksheet.columns = [
        { key: 'petition_number', width: 15 },
        { key: 'petitioner_name', width: 32 },
        { key: 'document_owner', width: 32 },
        { key: 'relation_owner', width: 15 },
        { key: 'petitioner_address', width: 30 },
        { key: 'date_filed', width: 15 },
        { key: 'o_r_number', width: 15 },
        { key: 'amount_paid', width: 15 },
        { key: 'petition_date_granted', width: 15 },

    ];

    // Add the header row (which will now be the second row)
    const headerRow = worksheet.addRow([
        'PETITION NUMBER', 'NAME OF PETITIONER', 'DOCUMENT OWNER', 'RELATIONSHIP',
        'ADDRESS', 'DATE FILED', 'O.R. NO.', 'AMOUNT PAID', 'DATE FORWARDED TO CRG'
    ]);

    // Format the header row
    headerRow.font = { bold: true };
    headerRow.height = 50;
    headerRow.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = borderStyle;
    });

    // Sort Data
    const sortedData = main_data.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));




    // Add rows and center data in each cell
    sortedData.forEach(item => {
        // Is it??
        const document_owner = item.document_owner === 'N/A' ? item.petitioner_name : item.document_owner
        const relation_owner = item.relation_owner === 'N/A' ? 'Owner' : item.relation_owner

        const row = worksheet.addRow({
            petition_number: item.petition_number,
            petitioner_name: item.petitioner_name,
            document_owner: document_owner,
            relation_owner: relation_owner,
            petitioner_address: item.petitioner_address,
            date_filed: item.date_filed,
            o_r_number: item.o_r_number,
            amount_paid: item.amount_paid,
            petition_date_granted: item.petition_date_granted,

        });

        row.height = 30; // Adjust the height for the row

        // Center the content for each row and add borders
        row.eachCell(cell => {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = borderStyle;
        });
    });

    const output_dir = join(__dirname, `../../exported/${Date.now()}`);

    // Ensure the directory exists
    if (!fs.existsSync(output_dir)) {
        fs.mkdirSync(output_dir, { recursive: true });
    }


    const time = format(new Date(), 'p')

    const file = join(output_dir, `${month} ${year} ${main_data.petition_type}.xlsx`)

    await workbook.xlsx.writeFile(file);
    return { status: true, dir: file };
}
