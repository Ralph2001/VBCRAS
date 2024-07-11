import { degrees, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const fs = require('fs')
const path = require('path')



export async function generate_form(formData) {
    console.log(formData)

    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const TimesRomanBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)
    const TimesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)


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
    const right_file = fs.readFileSync(rightLogoPath)
    const left_file = fs.readFileSync(leftLogoPath)

    const right_logo = await pdfDoc.embedPng(right_file)
    const left_logo = await pdfDoc.embedPng(left_file)

    const right_logo_scale = right_logo.scale(0.3)
    const left_logo_scale = left_logo.scale(0.3)

    // declared variable
    // 1A 1B 1C, 2A, 2B and so on...
    const FORM_TYPE = formData.form_type


    // Set Page Size inch converted to points

    const size_of_paper_by_type_x = FORM_TYPE.includes('A') ? 612 : 595.44
    const size_of_paper_by_type_y = FORM_TYPE.includes('A') ? 936 : 841.68

    const page = pdfDoc.addPage([size_of_paper_by_type_x, size_of_paper_by_type_y])

    const fontSize = 12 // Font Size
    const { width, height } = page.getSize()


    const header = [
        'Civil Registry Form No. 1A',
        '(Birth - Available)'
    ]

    let header_gap = 0
    for (const item of header) {
        page.drawText(item, {
            x: 33,
            y: height - 3 * fontSize - header_gap,
            size: fontSize,
            font: timesRomanFont,
        })
        header_gap += 14
    }


    const position_logo_paper_by_type_x = FORM_TYPE.includes('A') ? 131 : 120
    const position_logo_paper_by_type_y = FORM_TYPE.includes('A') ? 802.75 : 700
    /////////Logo Here//////////
    /// Left Logo
    page.drawImage(left_logo, {
        x: 410,
        y: position_logo_paper_by_type_y,
        width: left_logo_scale.width,
        height: left_logo_scale.height,
    })

    /// Right Logo
    page.drawImage(right_logo, {
        x: position_logo_paper_by_type_x,
        y: position_logo_paper_by_type_y,
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
    const localcivilregistry_width = timesRomanFontBold.widthOfTextAtSize('LOCAL CIVIL REGISTRY OFFICE', fontSize);
    page.drawText('LOCAL CIVIL REGISTRY OFFICE', {
        x: page.getWidth() / 2 - localcivilregistry_width / 2,
        y: height - 6 * fontSize - 66,
        size: fontSize,
        font: timesRomanFontBold,
    })

    // Date Filed
    page.drawText('July 09, 2024', {
        x: 465,
        y: height - 6 * fontSize - 95,
        size: fontSize,
        font: timesRomanFont,
    })

    // TO WHOM IT MAY CONCERN
    page.drawText('TO WHOM IT MAY CONCERN:', {
        x: 72,
        y: height - 6 * fontSize - 125,
        size: fontSize,
        font: TimesRomanBoldItalic,
    })


    // This will create 'We Clerify...' if form type is A
    FORM_TYPE.includes('A') ? create_we_clerify(page, height, fontSize, timesRomanFont, timesRomanFontBold) : ''
    FORM_TYPE.includes('A') ? create_info_list(page, height, fontSize, timesRomanFont, timesRomanFontBold) : create_paragraph_format(page, height, fontSize, timesRomanFont, timesRomanFontBold)


    const certification = [
        { text: 'This certification is issued to', isBold: false },
        { text: ' Ralph A. Villanueva ', isBold: true },
        { text: ' upon his/her request.', isBold: false },
    ]
    const total_width_certification = timesRomanFont.widthOfTextAtSize(`This certification is issued to Ralph A. Villanueva upon his/her request.`, fontSize)
    let certification_gap = 0
    for (const items of certification) {
        const font = items.isBold ? timesRomanFontBold : timesRomanFont
        const gap_between = font.widthOfTextAtSize(items.text, fontSize);
        page.drawText(items.text, {
            x: (page.getWidth() / 2 - total_width_certification / 2) + certification_gap,
            y: 310,
            size: fontSize,
            font: items.isBold ? timesRomanFontBold : timesRomanFont,
        })
        certification_gap += gap_between
    }



    page.drawText('Verified by:', {
        x: 72, // 72 = 1 margin
        y: 216, // 72 x 3 margin
        size: fontSize,
        font: TimesRomanItalic,
    })

    // MCR
    page.drawText('ISMAEL D. MALICDEM, JR.', {
        x: 360,
        y: 216, // 72 x 3 margin
        size: fontSize,
        font: timesRomanFontBold,
    })
    const mcr_width = timesRomanFontBold.widthOfTextAtSize('ISMAEL D. MALICDEM, JR.', fontSize);
    const mcr_position_width = timesRomanFontBold.widthOfTextAtSize('Municipal Civil Registrar', fontSize);

    page.drawText('Municipal Civil Registrar', {
        x: (mcr_width / 2 - mcr_position_width / 2) + 360,
        y: 204, // 72 x 3 - 12 margin
        size: fontSize,
        font: TimesRomanItalic,
    })

    // Verifier
    page.drawText('ERIKA JOYCE B. PARAGAS', {
        x: 144,
        y: 165.6,
        size: fontSize,
        font: timesRomanFontBold,
    })
    const verifier_width = timesRomanFontBold.widthOfTextAtSize('ERIKA JOYCE B. PARAGAS', fontSize);
    const verifier_position_width = timesRomanFontBold.widthOfTextAtSize('Administrative Aide II', fontSize);

    page.drawText('Administrative Aide II', {
        x: (verifier_width / 2 - verifier_position_width / 2) + 144,
        y: 153.6,
        size: fontSize,
        font: TimesRomanItalic,
    })

    // Billing Section

    const billing_info = [
        { title: "Amount Paid", data: 'P 1, 2000' },
        { title: "O.R. Number", data: '235125896' },
        { title: "Date Paid", data: 'July 09, 2024' }
    ]

    const billing_info_x = 76
    const billing_info_y = 108

    let billing_info_gap = 0
    for (const items of billing_info) {
        page.drawText(items.title, {
            x: billing_info_x,
            y: billing_info_y - billing_info_gap,
            size: fontSize,
            font: timesRomanFont,
        })

        page.drawText(':', {
            x: billing_info_x + 72,
            y: billing_info_y - billing_info_gap,
            size: fontSize,
            font: timesRomanFont,
        })
        page.drawText(items.data, {
            x: billing_info_x + 85,
            y: billing_info_y - billing_info_gap,
            size: fontSize,
            font: timesRomanFont,
        })

        billing_info_gap += 16
    }

    // Do i really need to make it 
    const note = [
        { title: 'Note:', isBold: true },
        { title: 'A mark, erasure or alteration of any entry invalidates this certification.', isBold: false }
    ]
    let note_gap = 0
    for (const item of note) {
        const width = timesRomanFontBold.widthOfTextAtSize(item.title, fontSize) + 4;
        page.drawText(item.title, {
            x: 72 + note_gap,
            y: 36,
            size: fontSize,
            font: item.isBold ? timesRomanFontBold : timesRomanFont,
        })
        note_gap += width
    }


    const pdfBytes = await pdfDoc.saveAsBase64()
    return { status: true, pdfbase64: pdfBytes }
}


// We Clerify that .... only in forms A
function create_we_clerify(page, height, fontSize, timesRomanFont, timesRomanFontBold) {

    const type = 'birth'
    const typeofdocument = 'Births'

    page.drawText(`We certify that among others the following facts of ${type} appear in our Register of`, {
        x: 125,
        y: height - 6 * fontSize - 150,
        size: fontSize,
        font: timesRomanFont,
    })
    page.drawText(`${typeofdocument} on page ________ book number ________. `, {
        x: 72,
        y: height - 6 * fontSize - 167,
        size: fontSize,
        font: timesRomanFont,
    })

    const space_page = timesRomanFont.widthOfTextAtSize(`${typeofdocument} on page`, fontSize);


    // Page Number
    page.drawText('16', {
        x: 72 + space_page + 20,
        y: height - 6 * fontSize - 167,
        size: fontSize,
        font: timesRomanFontBold,
    })
    const space_book = timesRomanFont.widthOfTextAtSize(`${typeofdocument} on page ________ book number`, fontSize);
    // Book Number
    page.drawText('12', {
        x: 72 + space_book + 20,
        y: height - 6 * fontSize - 167,
        size: fontSize,
        font: timesRomanFontBold,
    })

}

// Create Info List if type of form is A
function create_info_list(page, height, fontSize, timesRomanFont, timesRomanFontBold) {
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
    const table_position_x = 110 // Make This Dynamic
    const table_position_y = 196 // Make This Dynamic
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

        table_gap += 30
    }
}

// Shems loop malala
function create_paragraph_format(page, height, fontSize, timesRomanFont, timesRomanFontBold) {
    const data = `We certify that this office has no record of birth of {{EMERITO CURAMENG CASTILLO CASTILLO}} who is alleged to have been born on {{September 22, 1953}} in this municipality, of parents {{Romulo Mamaril Castillo Sr.}} and {{Felicidad Frias Curameng}}. Hence, we cannot issue, as requested, a true copy of his/her Certificate of Live Birth or transcription from the Register of Births.`
    const data_marriage = 'We certify that this office has no record of marriage between {{ANGEL CALDITO SUELEN}} and {{ROSA BRUSO BUNAO}} who were alleged to have been married on {{December 24, 1968}} in this municipality. Hence, we cannot issue, as requested, a true copy of certificate of Marriage or Transcription from the Register of Marriages. '


    const we_certify_with_line_break = add_line_break(data, page, height, fontSize, timesRomanFont, timesRomanFontBold)
    const add_blanks = addBlanks(we_certify_with_line_break)
    const distribute = distributeBlanks(add_blanks)

    /////////
    // For Debugging
    /////////

    let widthofit = 0
    for (const items of we_certify_with_line_break) {
        for (const item of items) {
            widthofit += item.size
        }
        console.log(widthofit)
        widthofit = 0

    }

    /////////
    // For Debugging
    /////////


    // Start Typing
    let splitedwidth = 0
    let info_spacing = 0
    let not_first = false
    for (const items of distribute) {
        const add_tab = not_first ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: (72 + add_tab) + splitedwidth,
                y: 600 - info_spacing,
                size: fontSize,
                font: item.isBold ? timesRomanFontBold : timesRomanFont,
                lineHeight: 14
            })
            not_first = true
            splitedwidth += item.size
        }
        info_spacing += 16
        splitedwidth = 0
    }


    const we_also_certify = 'We also certify that the records of births for the year {{1953}} are still intact in the archives of this office'
    const we_also_certify_with_break = add_line_break(we_also_certify, page, height, fontSize, timesRomanFont, timesRomanFontBold)

    let not_first_certify = false
    let we_also_spacing = 0
    let we_also_gap = 0

    for (const items of we_also_certify_with_break) {
        const add_tab = not_first_certify ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: (72 + add_tab) + we_also_gap,
                y: 500 - we_also_spacing,
                size: fontSize,
                font: item.isBold ? timesRomanFontBold : timesRomanFont,
                lineHeight: 14
            })
            we_also_gap += item.size
            not_first_certify = true
        }
        we_also_spacing += 16
        we_also_gap = 0
    }

}



function add_line_break(data, page, height, fontSize, timesRomanFont, timesRomanFontBold) {

    const splitted = data.trim().split(' ')
    const filtered = []
    let currentArray = [] // Changeable kasi
    let totalWidthSoFar = 0
    let isBold = false
    let this_is_not_the_first = false


    for (const item of splitted) {

        const fontType = isBold ? timesRomanFontBold : timesRomanFont
        const widthofText = fontType.widthOfTextAtSize(item.replace('{{', '').replace('}}', ''), fontSize) + 4;

        item.includes('{{') && item.includes('}}') ? isBold = false : item.includes('{{') ? isBold = true : item.includes('}}') ? isBold = false : ''

        const tell_the_max_space = this_is_not_the_first ? 451 : 415

        if (totalWidthSoFar + widthofText > tell_the_max_space) {
            filtered.push(currentArray);
            currentArray = [];
            this_is_not_the_first = true
            totalWidthSoFar = 0; // Reset the width
        }


        if (item.includes('{{') && item.includes('}}')) {
            currentArray.push({ data: item.replace('{{', '').replace('}}', ''), isBold: true, size: widthofText })
            totalWidthSoFar += widthofText;
            this_is_not_the_first = true
            continue
        }

        if (item.includes('}}')) {
            currentArray.push({ data: item.replace('{{', '').replace('}}', ''), isBold: true, size: widthofText })
            totalWidthSoFar += widthofText;
            this_is_not_the_first = true
            continue
        }

        currentArray.push({ data: item.replace('{{', '').replace('}}', ''), isBold: isBold, size: widthofText })
        totalWidthSoFar += widthofText;
        this_is_not_the_first = true
    }

    if (currentArray.length > 0) {
        filtered.push(currentArray);
    }

    return filtered
}



function addBlanks(data) {
    const targetWidth = 451;
    const minimumWidthToAddBlanks = 200;

    let newData = []
    let this_is_not_the_first = false

    for (const items of data) {
        let totalWidth = items.reduce((acc, item) => acc + item.size, 0);
        const tell_the_max_space = this_is_not_the_first ? targetWidth : 415
        if (totalWidth < minimumWidthToAddBlanks) {
            newData.push([...items]);
            this_is_not_the_first = true
            continue;
        }

        if (totalWidth <= tell_the_max_space) {

            let newLine = [...items];
            const remainingSpace = tell_the_max_space - totalWidth;
            const blankItem = { data: ' ', isBold: false, size: 1 };
            const numberOfBlanks = Math.ceil(remainingSpace);

            for (let i = 0; i < numberOfBlanks; i++) {
                newLine.push(blankItem);
            }
            newData.push(newLine);
            this_is_not_the_first = true
        } else {
            newData.push([...items]);
            this_is_not_the_first = true
        }


    }

    return newData
}



function distributeBlanks(data) {
    return data.map(array => {

        const nonBlanks = array.filter(item => item.data.trim() !== '');
        const blanks = array.filter(item => item.data.trim() === '');
        const totalNonBlanks = nonBlanks.length;
        const blanksPerGap = Math.floor(blanks.length / (totalNonBlanks - 1));
        const extraBlanks = blanks.length % (totalNonBlanks - 1);


        let distributedArray = [];
        let blankIndex = 0;

        nonBlanks.forEach((item, index) => {
            distributedArray.push(item);
            if (index < totalNonBlanks - 1) {
                for (let i = 0; i < blanksPerGap; i++) {
                    distributedArray.push(blanks[blankIndex++]);
                }

                if (index < extraBlanks) {
                    distributedArray.push(blanks[blankIndex++]);
                }
            }
        });

        return distributedArray;
    });
}