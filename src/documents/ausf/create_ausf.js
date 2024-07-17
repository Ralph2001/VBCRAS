import { degrees, PageSizes, PDFDocument, rgb, StandardFonts, TextAlignment } from 'pdf-lib'
const fs = require('fs')
const path = require('path')

export async function generate_ausf(formData) {
    console.log(formData)

    const ausf_main_template = path.resolve(__dirname, '../../resources/documents/AUSF/main_ausf_template.pdf')
    const main_template = fs.readFileSync(ausf_main_template)

    const pdfDoc = await PDFDocument.load(main_template)

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const TimesRomanBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)
    const TimesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)

    pdfDoc.setTitle(`AUSF - ${formData.child_name}`, {
        showInWindowTitleBar: true,
    })
    pdfDoc.setAuthor('VBCRAS')
    pdfDoc.setKeywords(['amazing', 'one piece', 'pdf generate'])
    pdfDoc.setProducer('VBCRAS')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())


    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    const fontSize = 12

    firstPage.drawText('Bayambang, Pangasinan', {
        x: 57.6,
        y: 779.76,
        size: fontSize,
        font: timesRomanFont,
    })


    const first_registry_number = create_center_text_within_box(firstPage, formData.registry_number, fontSize, timesRomanFontBold, height, 417.2, 109.44, 810) // text_position_x, box_width, text_position_y
    const first_date_registration = create_center_text_within_box(firstPage, formData.date_registration, fontSize, timesRomanFontBold, height, 438.48, 127.44, 790.56) // text_position_x, box_width, text_position_y

    const affiant_name = create_center_text_within_box(firstPage, formData.affiant_name, fontSize, timesRomanFontBold, height, 100, 300, 708.48) // text_position_x, box_width, text_position_y
    const citizenship = create_center_text_within_box(firstPage, formData.citizenship, fontSize, timesRomanFontBold, height, 410, 72, 708.48) // text_position_x, box_width, text_position_y
    const age = create_center_text_within_box(firstPage, formData.age, fontSize, timesRomanFontBold, height, 483, 90, 708.48) // text_position_x, box_width, text_position_y


    const address = create_center_text_within_box(firstPage, formData.address, fontSize, timesRomanFontBold, height, 140.4, 301.68, 681.84) // text_position_x, box_width, text_position_y
    const surname = create_center_text_within_box(firstPage, formData.surname, fontSize, timesRomanFontBold, height, 249.12, 174.96, 627.68) // text_position_x, box_width, text_position_y

    const certificate_of = formData.in
    if (certificate_of === 'the') {
        const name_child = create_center_text_within_box(firstPage, 'x', fontSize, timesRomanFontBold, height, 54, 19.44, 578) // text_position_x, box_width, text_position_y
    }
    else if (certificate_of === 'my') {
        const name_child = create_center_text_within_box(firstPage, 'x', fontSize, timesRomanFontBold, height, 54, 19.44, 606.92)
    }

    const name_child = create_center_text_within_box(firstPage, formData.child_name, fontSize, timesRomanFontBold, height, 308.88, 239.76, 577.32) // text_position_x, box_width, text_position_y
    const relationship = create_center_text_within_box(firstPage, formData.relation, fontSize, timesRomanFontBold, height, 136.8, 154.08, 549.36) // text_position_x, box_width, text_position_y

    const date_of_birth = create_center_text_within_box(firstPage, formData.date_birth, fontSize, timesRomanFontBold, height, 182.16, 108.72, 522) // text_position_x, box_width, text_position_y
    const at_municipality = create_center_text_within_box(firstPage, formData.at_municipality, fontSize, timesRomanFontBold, height, 296.64, 77.76, 522) // text_position_x, box_width, text_position_y
    const at_province = create_center_text_within_box(firstPage, formData.at_province, fontSize, timesRomanFontBold, height, 380.88, 83.52, 522) // text_position_x, box_width, text_position_y
    const at_country = create_center_text_within_box(firstPage, formData.at_country, fontSize, timesRomanFontBold, height, 470.16, 78.48, 522) // text_position_x, box_width, text_position_y

    const registry_number = create_center_text_within_box(firstPage, formData.registry_number, fontSize, timesRomanFontBold, height, 275, 96.48, 495.36) // text_position_x, box_width, text_position_y
    const date_registration = create_center_text_within_box(firstPage, formData.date_registration, fontSize, timesRomanFontBold, height, 398.16, 135.36, 495.36) // text_position_x, box_width, text_position_y

    const registry_no = create_center_text_within_box(firstPage, 'N/A', fontSize, timesRomanFontBold, height, 140.4, 111.6, 446.4) // text_position_x, box_width, text_position_y
    const date_regis = create_center_text_within_box(firstPage, 'N/A', fontSize, timesRomanFontBold, height, 267.12, 118.8, 446.4) // text_position_x, box_width, text_position_y

    const pfsp_of = create_center_text_within_box(firstPage, 'N/A', fontSize, timesRomanFontBold, height, 325.44, 146.88, 426.24) // text_position_x, box_width, text_position_y


    const lcroffice_at = create_center_text_within_box(firstPage, formData.lcro_at, fontSize, timesRomanFontBold, height, 396, 146.16, 391.68) // text_position_x, box_width, text_position_y

    const signature_at = create_center_text_within_box(firstPage, formData.day_signature, fontSize, timesRomanFontBold, height, 367.92, 55.44, 308.16, true) // text_position_x, box_width, text_position_y
    const month_of = create_center_text_within_box(firstPage, formData.month_signature, fontSize, timesRomanFontBold, height, 458.64, 90, 308.16) // text_position_x, box_width, text_position_y

    const affiant_signature = create_center_text_within_box(firstPage, formData.affiant_name, fontSize, timesRomanFontBold, height, 309.6, 239.76, 239.04) // text_position_x, box_width, text_position_y


    const sworn_day = create_center_text_within_box(firstPage, formData.sworn_day, fontSize, timesRomanFontBold, height, 344.16, 33.12, 169.92, true) // text_position_x, box_width, text_position_y
    const sworn_month = create_center_text_within_box(firstPage, formData.sworn_month, fontSize, timesRomanFontBold, height, 421.2, 100.8, 169.92) // text_position_x, box_width, text_position_y
    const sworn_municipality = create_center_text_within_box(firstPage, formData.sworn_at, fontSize, timesRomanFontBold, height, 190.8, 185.76, 156.24) // text_position_x, box_width, text_position_y

    const exhibiting_his_her = create_center_text_within_box(firstPage, formData.exhibiting, fontSize, timesRomanFontBold, height, 56.88, 172.08, 141.84) // text_position_x, box_width, text_position_y
    const exhibiting_number = create_center_text_within_box(firstPage, formData.exhibiting_number, fontSize, timesRomanFontBold, height, 231.12, 76.32, 141.84) // text_position_x, box_width, text_position_y
    const exhibiting_issued_at = create_center_text_within_box(firstPage, formData.exhibiting_at, fontSize, timesRomanFontBold, height, 374.4, 156.24, 141.84) // text_position_x, box_width, text_position_y
    const exhibiting_issued_on = create_center_text_within_box(firstPage, formData.exhibiting_on, fontSize, timesRomanFontBold, height, 56.88, 108, 127.44) // text_position_x, box_width, text_position_y

    const pdfBytes = await pdfDoc.saveAsBase64()
    return { status: true, pdfbase64: pdfBytes }
}




function create_center_text_within_box(firstPage, text, fontSize, font, height, text_position_x, box_width, text_position_y, isDay = false) {
    console.log(text)
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const centeredX = text_position_x + (box_width - textWidth) / 2;
    const centeredY = text_position_y;

    // if (isDay) {
    //     const split = text.split(' ')
    //     for (const item of split) {
    //         const textWidth = font.widthOfTextAtSize(item, fontSize);
    //         const centeredX = text_position_x + (box_width - textWidth) / 2;
    //         const centeredY = text_position_y;
    //         firstPage.drawText(item, {
    //             x: centeredX,
    //             y: centeredY,
    //             size: fontSize,
    //             font: font,
    //             alignment: TextAlignment.Left

    //         })
    //     }
    //     return
    // }

    firstPage.drawText(text, {
        x: centeredX,
        y: centeredY,
        size: fontSize,
        font: font,
        alignment: TextAlignment.Center

    })
}
