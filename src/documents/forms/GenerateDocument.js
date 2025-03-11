import { degrees, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns';
const fs = require('fs')
const path = require('path')



export async function generate_available_form(data) {

    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const TimesRomanBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)
    const TimesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)

    const FORM_TYPE = data.form_type
    /**
     *  Form Type
     *  Example
     *  1A, 2A, 3A
     */

    document_metadata(pdfDoc, data)
    await documemt_logo(pdfDoc, info)


    /**
     * Paper Size 
     */

    const size_of_paper_by_type_x = 612
    const size_of_paper_by_type_y = 936

    /**
     * Main Page
     */
    const page =
        pdfDoc.addPage
            ([size_of_paper_by_type_x, size_of_paper_by_type_y])

    /**
     * Default Font Size
     */
    const FONT_SIZE = 12
    const { width, height } = page.getSize()

}

function document_metadata(pdfDoc, info) {
    const form_type = data.form_type
    const document_owner = data.name_of
    pdfDoc.setTitle(`Form ${form_type} - ${document_owner}`, {
        showInWindowTitleBar: true,
    })
    pdfDoc.setAuthor('VBCRAS')
    pdfDoc.setSubject(`Form ${form_type} `)
    pdfDoc.setKeywords(['amazing', 'the one piece is real', 'pdf generate'])
    pdfDoc.setProducer('VBCRAS')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())
}

async function documemt_logo(pdfDoc) {

    const rightLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_bayambang.png'
    ).replace('app.asar', 'app.asar.unpacked')
    const leftLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_lcro.png'
    ).replace('app.asar', 'app.asar.unpacked')


    /**
     * Logo Binary
     */
    const right_file = fs.readFileSync(rightLogoPath)
    const left_file = fs.readFileSync(leftLogoPath)

    const right_logo = await pdfDoc.embedPng(right_file)
    const left_logo = await pdfDoc.embedPng(left_file)

    const right_logo_scale = right_logo.scale(0.3)
    const left_logo_scale = left_logo.scale(0.3)

    const position_logo_paper_by_type_x = 121
    const position_logo_paper_by_type_y = 802.75

    page.drawImage(left_logo, {
        x: 420,
        y: position_logo_paper_by_type_y,
        width: left_logo_scale.width,
        height: left_logo_scale.height,
    })
    page.drawImage(right_logo, {
        x: position_logo_paper_by_type_x,
        y: position_logo_paper_by_type_y,
        width: right_logo_scale.width,
        height: right_logo_scale.height,
    })
}