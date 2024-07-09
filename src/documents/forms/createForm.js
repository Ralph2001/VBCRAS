import { degrees, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const fs = require('fs')
const path = require('path')


export async function generate_form() {
    let pdfBytes = ''

    const pdfDoc = await PDFDocument.create()

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const TimesRomanBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)

    pdfDoc.setTitle('Form ', {
        showInWindowTitleBar: true,
    })
    pdfDoc.setAuthor('VBCRAS')
    pdfDoc.setSubject('Form')
    pdfDoc.setKeywords(['amazing', 'one piece', 'pdf generate'])
    pdfDoc.setProducer('VBCRAS')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())

    const leftLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_bayambang.png'
    )
    const rightLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_lcro.png'
    )

    //Logo

    const right_file = fs.readFileSync(rightLogoPath, { encoding: 'utf8' })
    const right_logo = await pdfDoc.embedPng(right_file)


    const right_logo_scale = right_logo.scale(0.5)





    const page = pdfDoc.addPage([614, 936]) // Set Page Size Default: 6.5 x 13 converted to points

    const fontSize = 12 // Font Size
    const { width, height } = page.getSize()





    const header = [
        'Civil Registry Form No. 1A',
        '(Birth - Available)'
    ]

    let header_gap = 0
    for (const item of header) {
        page.drawText(item, {
            x: 20,
            y: height - 2 * fontSize - header_gap,
            size: fontSize,
            font: timesRomanFont,
        })
        header_gap += 14
    }

    ///////////////////
    page.drawImage(rightLogoData, {
        x: page.getWidth() / 2 - right_logo_scale.width / 2,
        y: page.getHeight() / 2 - right_logo_scale.height / 2 + 250,
        width: right_logo_scale.width,
        height: right_logo_scale.height,
    })
    //////////////////



    const header_2 = [
        'Republic of the Philippines',
        'Province of Pangasinan',
    ]
    let header_2_gap = 0
    for (const item of header_2) {
        const textWidth = timesRomanFont.widthOfTextAtSize(item, fontSize);
        const textHeight = timesRomanFont.heightAtSize(fontSize);
        page.drawText(item, {
            x: page.getWidth() / 2 - textWidth / 2,
            y: height - 6 * fontSize - header_2_gap,
            size: fontSize,
            font: timesRomanFont,
        })
        header_2_gap += 14
    }

    // Municipality
    const municipality_width = timesRomanFontBold.widthOfTextAtSize('MUNICIPALITY OF BAYAMBANG', fontSize);
    page.drawText('MUNICIPALITY OF BAYAMBANG', {
        x: page.getWidth() / 2 - municipality_width / 2,
        y: height - 6 * fontSize - 28,
        size: fontSize,
        font: timesRomanFontBold,
    })

    // Local Civil Registry
    const localcivilregistry_width = timesRomanFontBold.widthOfTextAtSize('LOCAL CIVIL REGISTRY', fontSize);
    page.drawText('LOCAL CIVIL REGISTRY', {
        x: page.getWidth() / 2 - localcivilregistry_width / 2,
        y: height - 6 * fontSize - 56,
        size: fontSize,
        font: timesRomanFontBold,
    })

    // Date Filed
    page.drawText('July 09, 2024', {
        x: 490,
        y: height - 6 * fontSize - 86,
        size: fontSize,
        font: timesRomanFont,
    })

    // TO WHOM IT MAY CONCERN
    page.drawText('TO WHOM IT MAY CONCERN:', {
        x: 55,
        y: height - 6 * fontSize - 116,
        size: fontSize,
        font: TimesRomanBoldItalic,
    })


    const table = [
        { title: "Registry number", data: '2001-16' },
        { title: "Date of registration", data: 'May 16, 2001' },
        { title: "Name of child", data: 'RALPH ADVINCULA VILLANUEVA' },
        { title: "Sex", data: 'Male' },
        { title: "Date of birth", data: 'May 16, 2001' },
        { title: "Place of birth", data: 'Alcala, Pangasinan' },
        { title: "Name of Mother", data: 'Anita A.  Villanueva' },
        { title: "Citizenship of Mother", data: 'Filipino' },
        { title: "Name of Father", data: 'Rolando M. Villanueva' },
        { title: "Citizenship of Father", data: 'Filipino' },
        { title: "Date of Marriage", data: 'December 28, 1997' },
        { title: "Place of marriage of parents", data: 'Alcala, Pangasinan' },
    ]

    let table_gap = 0
    const table_position_x = 95
    const table_position_y = 166
    for (const items of table) {
        page.drawText(items.title, {
            x: table_position_x,
            y: height - 6 * fontSize - (table_position_y + table_gap),
            size: fontSize,
            font: timesRomanFont,
        })

        page.drawText(":", {
            x: table_position_x + 145,
            y: height - 6 * fontSize - ((table_position_y - 1) + table_gap),
            size: fontSize,
            font: timesRomanFont,
        })
        page.drawText(items.data, {
            x: table_position_x + 155,
            y: height - 6 * fontSize - (table_position_y + table_gap),
            size: fontSize,
            font: timesRomanFontBold,
        })



        table_gap += 34
    }


    pdfBytes = await pdfDoc.saveAsBase64()
    return { status: true, pdfbase64: pdfBytes }
}