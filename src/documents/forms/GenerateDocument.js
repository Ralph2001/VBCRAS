import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'

const fs = require('fs')
const path = require('path')

// Configuration constants
const CONFIG = {
    pageSize: {
        width: 612,
        height: 936
    },
    logoPosition: {
        right: { x: 121 },
        left: { x: 420 },
        y: 802.75
    },
    logoScale: {
        right: 0.3,
        left: 0.3
    },
    FONT_SIZE: 12
}

// Main function to generate the PDF form
export async function generateFormPDF(main_data) {
    const data = JSON.parse(main_data)
    const pdfDoc = await PDFDocument.create()

    // Load and embed fonts
    const fonts = {
        regular: await pdfDoc.embedFont(StandardFonts.TimesRoman),
        bold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
        boldItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic),
        italic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
    }
    const FORM_TYPE = data.form_type

    const size_of_paper_by_type_x = FORM_TYPE.includes('A') ? 612 : 595.44
    const size_of_paper_by_type_y = FORM_TYPE.includes('A') ? 936 : 841.68
    const page = pdfDoc.addPage([
        size_of_paper_by_type_x,
        size_of_paper_by_type_y
    ])

    const { width, height } = page.getSize()
    // Set document metadata
    document_metadata(pdfDoc, data)

    // Draw logos
    await document_logo(data, page, pdfDoc)

    // Draw header
    document_header(data, page, fonts, height, CONFIG.FONT_SIZE)

    // Draw base content (date, verification info, billing, etc.)
    document_base(data, page, fonts, height, CONFIG.FONT_SIZE)

    if (data.is_with_authentication) {
        await createAuthenticationForm(pdfDoc, data, fonts, CONFIG.FONT_SIZE)
    }


    // Assuming the `data` and `page` objects, and other necessary constants are already set
    if (data.form_type.includes('A')) {
        // If form type includes 'A', create "we certify" text and handle available documents
        create_we_clerify(data, page, height, CONFIG.FONT_SIZE, fonts);
        document_body_available(data, page, height, CONFIG.FONT_SIZE, fonts);
    } else {
        // Handle form types 'B' and 'C'
        if (data.form_type.includes('B')) {
            // Form type 'B' is for intact records
            document_body_intact(data, page, height, CONFIG.FONT_SIZE, fonts.regular, fonts.bold);
        } else if (data.form_type.includes('C')) {
            // Form type 'C' is for destroyed records
            document_body_destroyed(data, page, height, CONFIG.FONT_SIZE, fonts.regular, fonts.bold);
        } else {
            // If the form type is not 'A', 'B', or 'C', log an error
            console.log('Invalid form type');
        }
    }


    // Draw Remarks if Available
    if (data.is_reconstructed || data.is_other_remarks) {
        createRemarks(pdfDoc, data, page, fonts, CONFIG.FONT_SIZE)
    }

    // Save the PDF as a Base64 string
    const pdfBytes = await pdfDoc.saveAsBase64()
    return { status: true, pdfbase64: pdfBytes }
}

// Set PDF metadata
function document_metadata(pdfDoc, data) {
    const form_type = data.form_type
    const document_owner = data.name_of
    pdfDoc.setTitle(`Form ${form_type} - ${document_owner}`, {
        showInWindowTitleBar: true
    })
    pdfDoc.setAuthor('VBCRAS')
    pdfDoc.setSubject(`Form ${form_type}`)
    pdfDoc.setKeywords(['amazing', 'the one piece is real', 'pdf generate'])
    pdfDoc.setProducer('VBCRAS')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())
}

// Draw logos on the page
async function document_logo(data, page, pdfDoc) {
    const rightLogoPath = path
        .resolve(__dirname, '../../resources/images/logo_bayambang.png')
        .replace('app.asar', 'app.asar.unpacked')
    const leftLogoPath = path
        .resolve(__dirname, '../../resources/images/logo_lcro.png')
        .replace('app.asar', 'app.asar.unpacked')

    const rightFile = fs.readFileSync(rightLogoPath)
    const leftFile = fs.readFileSync(leftLogoPath)

    const rightLogo = await pdfDoc.embedPng(rightFile)
    const leftLogo = await pdfDoc.embedPng(leftFile)

    const rightLogoScale = rightLogo.scale(Number(data.logo.right_scale))
    const leftLogoScale = leftLogo.scale(Number(data.logo.left_scale))

    page.drawImage(leftLogo, {
        x: Number(data.logo.left_x),
        y: Number(data.logo.left_y),
        width: leftLogoScale.width,
        height: leftLogoScale.height
    })
    page.drawImage(rightLogo, {
        x: Number(data.logo.right_x),
        y: Number(data.logo.right_y),
        width: rightLogoScale.width,
        height: rightLogoScale.height
    })
}

// Draw the header section
function document_header(data, page, fonts, height, fontSize) {
    const formTypeDescriptions = {
        '1A': '(Birth - Available)',
        '1B': '(Birth - Not Available)',
        '1C': '(Birth - Destroyed)',
        '2A': '(Death - Available)',
        '2B': '(Death - Not Available)',
        '2C': '(Death - Destroyed)',
        '3A': '(Marriage - Available)',
        '3B': '(Marriage - Not Available)',
        '3C': '(Marriage - Destroyed)'
    }

    const headerLines = [
        `Civil Registry Form No. ${data.form_type}`,
        formTypeDescriptions[data.form_type] || ''
    ]

    let headerGap = 0
    for (const line of headerLines) {
        page.drawText(line, {
            x: 33,
            y: height - 3 * fontSize - headerGap,
            size: fontSize,
            font: fonts.regular
        })
        headerGap += 14
    }

    const header2 = ['Republic of the Philippines', 'Province of Pangasinan']
    let header2Gap = 0
    for (const line of header2) {
        const textWidth = fonts.regular.widthOfTextAtSize(line, fontSize)
        page.drawText(line, {
            x: page.getWidth() / 2 - textWidth / 2,
            y: height - Number(data.header.y) * fontSize - header2Gap,
            size: fontSize,
            font: fonts.regular
        })
        header2Gap += 14
    }

    const municipalityText = 'MUNICIPALITY OF BAYAMBANG'
    const municipalityWidth = fonts.bold.widthOfTextAtSize(
        municipalityText,
        fontSize
    )
    page.drawText(municipalityText, {
        x: page.getWidth() / 2 - municipalityWidth / 2,
        y: height - Number(data.header.y) * fontSize - 28,
        size: fontSize,
        font: fonts.bold
    })

    const localRegistryText = 'LOCAL CIVIL REGISTRY OFFICE'
    const localRegistryWidth = fonts.bold.widthOfTextAtSize(
        localRegistryText,
        fontSize
    )
    page.drawText(localRegistryText, {
        x: page.getWidth() / 2 - localRegistryWidth / 2,
        y: height - Number(data.header.y) * fontSize - 66,
        size: fontSize,
        font: fonts.bold
    })
}

// Draw base content (date filed, verification, billing, and note)
function document_base(data, page, fonts, height, fontSize) {
    // Date Filed
    page.drawText(data.date_filed, {
        x: 465,
        y: height - Number(data.header.y) * fontSize - 95,
        size: fontSize,
        font: fonts.regular
    })

    // Header text
    page.drawText('TO WHOM IT MAY CONCERN:', {
        x: Number(data.concern.x),
        y: height - 6 * fontSize - Number(data.concern.y),
        size: fontSize,
        font: fonts.boldItalic
    })

    const sanitizedIssuedTo = data.certification_issued_to
        .replace(/"(.*?)"/g, '“$1”');

    const certificationParts = [
        { text: 'This certification is issued to', isBold: false },
        { text: ` ${sanitizedIssuedTo} `, isBold: true },
        { text: ' upon his/her request.', isBold: false }
    ];

    const fullCertification = `This certification is issued to ${sanitizedIssuedTo} upon his/her request.`;
    const totalWidth = fonts.regular.widthOfTextAtSize(
        fullCertification,
        fontSize
    )
    let gap = 0
    for (const part of certificationParts) {
        const currentFont = part.isBold ? fonts.bold : fonts.regular
        const partWidth = currentFont.widthOfTextAtSize(part.text, fontSize)
        page.drawText(part.text, {
            x: page.getWidth() / 2 - totalWidth / 2 + gap,
            y: Number(data.issued_to.y),
            size: fontSize,
            font: currentFont
        })
        gap += partWidth
    }

    // Verified by
    page.drawText('Verified by:', {
        x: Number(data.verifier.x),
        y: Number(data.verifier.y),
        size: fontSize,
        font: fonts.italic
    })

    /**
     * Civil Registrar Details, Add for and in the absence if checked
     */

    // Draw Civil Registrar
    page.drawText(data.civil_registrar, {
        x: Number(data.c_mcr.x),
        y: Number(data.c_mcr.y),
        size: fontSize,
        font: fonts.bold
    })

    const mcrWidth = fonts.bold.widthOfTextAtSize(
        data.civil_registrar,
        fontSize
    )

    // Draw Civil Registrar Position (centered under name)
    const civilRegistrarPosWidth = fonts.italic.widthOfTextAtSize(
        data.civil_registrar_position,
        fontSize
    )
    page.drawText(data.civil_registrar_position, {
        x: Number(data.c_mcr.x) + mcrWidth / 2 - civilRegistrarPosWidth / 2, // Correctly centered
        y: Number(data.c_mcr.y) - 12,
        size: fontSize,
        font: fonts.italic
    })

    if (data.for_and_in_the_absence) {
        // Calculate width of "For and in the absence of:"
        const absenceLabel = 'For and in the absence of:'
        const absenceLabelWidth = fonts.italic.widthOfTextAtSize(
            absenceLabel,
            fontSize
        )

        // Draw "For and in the absence of:" (centered under Civil Registrar)
        page.drawText(absenceLabel, {
            x: Number(data.c_mcr.x) + mcrWidth / 2 - absenceLabelWidth / 2, // Use its own width
            y: Number(data.c_mcr.y) + 12,
            size: fontSize,
            font: fonts.italic
        })

        // Calculate widths for Verifier's details
        const verifierNameWidth = fonts.bold.widthOfTextAtSize(
            data.absence_verified_by,
            fontSize
        )
        const verifierPosWidth = fonts.italic.widthOfTextAtSize(
            data.absence_verifier_position,
            fontSize
        )

        // Draw Verifier's Name (centered under Civil Registrar)
        page.drawText(data.absence_verified_by, {
            x: Number(data.c_mcr.x) + mcrWidth / 2 - verifierNameWidth / 2, // Use verifier's name width
            y: Number(data.c_mcr.y) - 50,
            size: fontSize,
            font: fonts.bold
        })

        // Draw Verifier's Position (centered under their name)
        page.drawText(data.absence_verifier_position, {
            x: Number(data.c_mcr.x) + mcrWidth / 2 - verifierPosWidth / 2, // Use verifier's position width
            y: Number(data.c_mcr.y) - 62,
            size: fontSize,
            font: fonts.italic
        })
    }

    // Verifier details
    page.drawText(data.verified_by, {
        x: Number(data.verifier.x) + 72, //Default 144,  Minus the verifier position
        y: Number(data.verifier.y) - 24.5, //Default 165.5
        size: fontSize,
        font: fonts.bold
    })
    const verifierWidth = fonts.bold.widthOfTextAtSize(
        data.verified_by,
        fontSize
    )
    const verifierPosWidth = fonts.bold.widthOfTextAtSize(
        data.verifier_position,
        fontSize
    )
    page.drawText(data.verifier_position, {
        x:
            Number(data.verifier.x) +
            72 +
            verifierWidth / 2 -
            verifierPosWidth / 2, //Default 144
        y: Number(data.verifier.y) - 36.5,
        size: fontSize,
        font: fonts.italic
    })

    // Billing Section
    const billingInfo = [
        { title: 'Amount Paid', data: data.amount_paid },
        { title: 'O.R. Number', data: data.or_number },
        { title: 'Date Paid', data: data.date_paid }
    ]
    const billingX = Number(data.billing_info.x)
    const billingY = Number(data.billing_info.y)
    let billingGap = 0
    for (const item of billingInfo) {
        page.drawText(item.title, {
            x: billingX,
            y: billingY - billingGap,
            size: fontSize,
            font: fonts.regular
        })
        page.drawText(':', {
            x: billingX + 72,
            y: billingY - billingGap,
            size: fontSize,
            font: fonts.regular
        })
        page.drawText(item.data, {
            x: billingX + 85,
            y: billingY - billingGap,
            size: fontSize,
            font: fonts.regular
        })
        billingGap += 16
    }

    // Note
    const noteParts = [
        { text: 'Note:', isBold: true },
        {
            text: 'A mark, erasure or alteration of any entry invalidates this certification.',
            isBold: false
        }
    ]
    let noteGap = 0
    for (const part of noteParts) {
        const currentFont = part.isBold ? fonts.bold : fonts.regular
        const partWidth = currentFont.widthOfTextAtSize(part.text, fontSize) + 4
        page.drawText(part.text, {
            x: 72 + noteGap,
            y: 50,
            size: fontSize,
            font: currentFont
        })
        noteGap += partWidth
    }
}

// Draw certification details for form types with "A"
function create_we_clerify(data, page, height, fontSize, fonts) {
    const type =
        data.form_type === '1A'
            ? 'birth'
            : data.form_type === '2A'
                ? 'death'
                : data.form_type === '3A'
                    ? 'marriage'
                    : ''
    const typeofdocument =
        data.form_type === '1A'
            ? 'Births'
            : data.form_type === '2A'
                ? 'Deaths'
                : data.form_type === '3A'
                    ? 'Marriage'
                    : ''

    page.drawText(
        `We certify that among others the following facts of ${type} appear in our Register of`,
        {
            x: Number(data.page_book_number.x), // 125
            y: height - 6 * fontSize - Number(data.page_book_number.y), // 150
            size: fontSize,
            font: fonts.regular
        }
    )
    page.drawText(`${typeofdocument} on page ________ book number ________. `, {
        x: Number(data.page_book_number.x) - 53,
        y: height - 6 * fontSize - (Number(data.page_book_number.y) + 17),
        size: fontSize,
        font: fonts.regular
    })

    const space_page = fonts.regular.widthOfTextAtSize(
        `${typeofdocument} on page`,
        fontSize
    )

    // Page Number
    page.drawText(data.page_number, {
        x: Number(data.page_book_number.x) - 53 + space_page + 20,
        y: height - 6 * fontSize - (Number(data.page_book_number.y) + 17),
        size: fontSize,
        font: fonts.bold
    })
    const space_book = fonts.regular.widthOfTextAtSize(
        `${typeofdocument} on page ________ book number`,
        fontSize
    )
    // Book Number
    page.drawText(data.book_number, {
        x: Number(data.page_book_number.x) - 53 + space_book + 20,
        y: height - 6 * fontSize - (Number(data.page_book_number.y) + 17),
        size: fontSize,
        font: fonts.bold
    })
}

// Draw the body/table for available forms
function document_body_available(data, page, height, fontSize, fonts) {
    const table_for_1 = [
        { title: 'Registry number', data: data.registry_number },
        { title: 'Date of registration', data: data.date_registration },
        { title: 'Name of child', data: data.name_child },
        { title: 'Sex', data: data.sex },
        { title: 'Date of birth', data: data.date_birth },
        { title: 'Place of birth', data: data.place_birth },
        { title: 'Name of Mother', data: data.name_mother },
        { title: 'Citizenship of Mother', data: data.citizenship_mother },
        { title: 'Name of Father', data: data.name_father },
        { title: 'Citizenship of Father', data: data.citizenship_father },
        { title: 'Date of Marriage', data: data.date_marriage_parents },
        {
            title: 'Place of marriage of parents',
            data: data.place_marriage_parents
        }
    ]

    const table_for_2 = [
        { title: 'Registry number', data: data.registry_number },
        { title: 'Date of registration', data: data.date_registration },
        { title: 'Name of deceased', data: data.name_deceased },
        { title: 'Sex', data: data.sex },
        { title: 'Age', data: data.deceased_age },
        { title: 'Civil Status', data: data.deceased_civil_status },
        { title: 'Citizenship', data: data.deceased_citizenship },
        { title: 'Date of Death', data: data.date_of_death },
        { title: 'Place of Death', data: data.place_of_death },
        { title: 'Cause of Death', data: data.cause_of_death }
    ]

    const table_for_3 = [
        { title: 'Name', data: data.groom_name, another_data: data.bride_name },
        { title: 'Age', data: data.groom_age, another_data: data.bride_age },
        {
            title: 'Citizenship',
            data: data.groom_citizenship,
            another_data: data.bride_citizenship
        },
        {
            title: 'Civil Status',
            data: data.groom_civil_status,
            another_data: data.bride_civil_status
        },
        {
            title: 'Mother',
            data: data.groom_mother,
            another_data: data.bride_mother
        },
        {
            title: 'Father',
            data: data.groom_father,
            another_data: data.bride_father
        },
        { title: 'Registry Number', data: data.registry_number },
        { title: 'Date of Registration', data: data.date_registration },
        { title: 'Date of Marriage', data: data.date_marriage },
        { title: 'Place of Marriage', data: data.place_marriage }
    ]

    const table = data.form_type.includes('1A')
        ? table_for_1
        : data.form_type.includes('2A')
            ? table_for_2
            : data.form_type.includes('3A')
                ? table_for_3
                : []

    let tableGap = 0
    const tablePositionX = Number(data.body_data.x)
    const tablePositionY = Number(data.body_data.y) // Adjust if needed

    // Function to check and adjust the font size for long text
    function getFontSizeBasedOnLength(text) {
        if (text.length > 50) return fontSize * 0.8;  // 20% reduction
        if (text.length > 40) return fontSize * 0.9;  // 10% reduction
        return fontSize;                              // Original size
    }

    for (const item of table) {
        const xAdderForDot =
            data.form_type.includes('1A') || data.form_type.includes('2A')
                ? 145
                : data.form_type.includes('3A') && item.another_data
                    ? 72
                    : data.form_type.includes('3A')
                        ? 107
                        : 0
        const xAdderForData =
            data.form_type.includes('1A') || data.form_type.includes('2A')
                ? 155
                : data.form_type.includes('3A') && item.another_data
                    ? 79
                    : data.form_type.includes('3A')
                        ? 127
                        : 0

        // Get the appropriate font size for each piece of data
        const dataFontSize = getFontSizeBasedOnLength(item.data)
        const anotherDataFontSize = item.another_data
            ? getFontSizeBasedOnLength(item.another_data)
            : null

        page.drawText(item.title, {
            x: tablePositionX,
            y: height - 6 * fontSize - (tablePositionY + tableGap),
            size: fontSize,
            font: fonts.regular
        })

        page.drawText(':', {
            x: tablePositionX + xAdderForDot,
            y: height - 6 * fontSize - (tablePositionY - 1 + tableGap),
            size: fontSize,
            font: fonts.regular
        })

        page.drawText(item.data, {
            x: tablePositionX + xAdderForData,
            y: height - 6 * fontSize - (tablePositionY + tableGap),
            size: dataFontSize, // Use the calculated font size
            font: fonts.bold
        })

        if (data.form_type.includes('3A') && item.another_data) {
            page.drawText(':', {
                x: tablePositionX + 283,
                y: height - 6 * fontSize - (tablePositionY - 1 + tableGap),
                size: fontSize,
                font: fonts.regular
            })
            page.drawText(item.another_data, {
                x: tablePositionX + 290,
                y: height - 6 * fontSize - (tablePositionY + tableGap),
                size: anotherDataFontSize, // Use the calculated font size for another data
                font: fonts.bold
            })
        }

        tableGap += 30
    }
}


function document_body_intact(data, page, height, fontSize, timesRomanFont, timesRomanFontBold) {
    const record_of = data.form_type.includes('1')
        ? 'of birth of '
        : data.form_type.includes('2')
            ? 'of death of'
            : data.form_type.includes('3')
                ? 'of marriage between'
                : ''
    const have_b = data.form_type.includes('1')
        ? 'have been born'
        : data.form_type.includes('2')
            ? 'have died'
            : data.form_type.includes('3')
                ? 'have been married'
                : ''
    const is_for_1 = data.form_type.includes('1')
        ? `, of parents {{${data.father_name}}} and {{${data.mother_name}}}`
        : ''
    const the_who_b =
        data.form_type.includes('1') || data.form_type.includes('2')
            ? 'who is'
            : 'who were'
    const is_for_3 = data.form_type.includes('3') ? ` and {{${data.married_with}}}` : ''
    const certificate_of = data.form_type.includes('1')
        ? 'Live Birth'
        : data.form_type.includes('2')
            ? 'Death'
            : data.form_type.includes('3')
                ? 'Marriage'
                : ''
    const register_of = data.form_type.includes('1')
        ? 'Births'
        : data.form_type.includes('2')
            ? 'Deaths'
            : data.form_type.includes('3')
                ? 'Marriages'
                : ''

    const document_owner = data.form_type.includes('1')
        ? data.no_record_birth_of
        : data.form_type.includes('2')
            ? data.no_record_death_of
            : data.form_type.includes('3')
                ? data.no_record_marriage_of
                : ''
    const date_field = data.form_type.includes('1')
        ? data.born_on
        : data.form_type.includes('2')
            ? data.died_on
            : data.form_type.includes('3')
                ? data.married_on
                : ''



    const we_clerify_for_b = `We certify that this office has no record ${record_of} {{${document_owner}}} ${is_for_3} ${the_who_b} alleged to ${have_b} on {{${date_field}}} in this municipality${is_for_1}. Hence, we cannot issue, as requested, a true copy of his/her Certificate of ${certificate_of} or transcription from the Register of ${register_of}.`

    const we_certify_with_line_break = add_line_break(
        we_clerify_for_b,
        page,
        height,
        fontSize,
        timesRomanFont,
        timesRomanFontBold
    )
    const add_blanks = addBlanks(we_certify_with_line_break)
    const distribute = distributeBlanks(add_blanks)

    const ParagraphPositionX = Number(data.body_data.x)
    const ParagraphPositionY = Number(data.body_data.y)
    // Start Typing
    let splitedwidth = 0
    let info_spacing = 0
    let not_first = false
    for (const items of distribute) {
        const add_tab = not_first ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: 72 + add_tab + splitedwidth,
                y: ParagraphPositionY - info_spacing,
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

    const we_also_certify_records_of_b = data.form_type.includes('1')
        ? 'births'
        : data.form_type.includes('2')
            ? 'deaths'
            : data.form_type.includes('3')
                ? 'marriage'
                : ''
    const intact_year = data.form_type.includes('1')
        ? data.intact_birth_year
        : data.form_type.includes('2')
            ? data.intact_death_year
            : data.form_type.includes('3')
                ? data.intact_marriage_year
                : ''
    const for_B = `We also certify that the records of ${we_also_certify_records_of_b} for the year {{${intact_year}}} are still intact in the archives of this office`

    const we_also_certify_with_break = add_line_break(
        for_B,
        page,
        height,
        fontSize,
        timesRomanFont,
        timesRomanFontBold
    )
    const we_also_certify_add_blanks = addBlanks(we_also_certify_with_break)
    const we_also_certify_distribute = distributeBlanks(
        we_also_certify_add_blanks
    )

    let not_first_certify = false
    let we_also_spacing = 0
    let we_also_gap = 0

    const minustoCertify = 100
    const WeAlsoCertifyPositionY = Number(data.body_data.y) - Number(minustoCertify)
    for (const items of we_also_certify_distribute) {
        const add_tab = not_first_certify ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: 72 + add_tab + we_also_gap,
                y: WeAlsoCertifyPositionY - we_also_spacing,
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

function document_body_destroyed(data, page, height, fontSize, timesRomanFont, timesRomanFontBold) {
    const we_clerify_for_c = `We certify that the records of births filed in the archives of this office, include those which were registered from {{1932}} to present. However, the records of births during the period {{1932 to 1946}} were totally destroyed by {{flood}}. Hence, we cannot issue as requested a true transcription from the Register of Births or true copy of the Certificate of Live Birth of {{ROMANA BATO SOLIS}} who was alleged to have been born on {{August 09, 1932}} in this municipality of parents {{Emelio Solis}} and {{Elena Bato.}}`

    const we_certify_with_line_break = add_line_break(
        we_clerify_for_c,
        page,
        height,
        fontSize,
        timesRomanFont,
        timesRomanFontBold
    )
    const add_blanks = addBlanks(we_certify_with_line_break)
    const distribute = distributeBlanks(add_blanks)

    const ParagraphPositionX = Number(data.body_data.x)
    const ParagraphPositionY = Number(data.body_data.y)
    // Start Typing
    let splitedwidth = 0
    let info_spacing = 0
    let not_first = false
    for (const items of distribute) {
        const add_tab = not_first ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: 72 + add_tab + splitedwidth,
                y: ParagraphPositionY - info_spacing,
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

    const for_C = `We also certify that for every registered birth, this office submits a copy of the Certificate of Live Birth to the Office of the Civil Registrar General, Philippine Statistics Authority (PSA), East Avenue, Diliman, Quezon City, Metro Manila. In view of this, the interested party is hereby advised to make further verification in the archives of that office.`

    const we_also_certify_with_break = add_line_break(
        for_C,
        page,
        height,
        fontSize,
        timesRomanFont,
        timesRomanFontBold
    )
    const we_also_certify_add_blanks = addBlanks(we_also_certify_with_break)
    const we_also_certify_distribute = distributeBlanks(
        we_also_certify_add_blanks
    )

    let not_first_certify = false
    let we_also_spacing = 0
    let we_also_gap = 0

    const minustoCertify = 150
    const WeAlsoCertifyPositionY = Number(data.body_data.y) - Number(minustoCertify)
    for (const items of we_also_certify_distribute) {
        const add_tab = not_first_certify ? 0 : 36
        for (const item of items) {
            page.drawText(item.data, {
                x: 72 + add_tab + we_also_gap,
                y: WeAlsoCertifyPositionY - we_also_spacing,
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


/**
 * Create Authenticated Form
 * It will create page 2
 * Automatic Center
 * With In the Absence
 */

async function createAuthenticationForm(pdfDoc, data, fonts, fontSize) {
    const FORM_TYPE = data.form_type
    const size_of_paper_by_type_x = FORM_TYPE.includes('A') ? 612 : 595.44
    const size_of_paper_by_type_y = FORM_TYPE.includes('A') ? 936 : 841.68
    const page = pdfDoc.addPage([
        size_of_paper_by_type_x,
        size_of_paper_by_type_y
    ])

    // const page = pdfDoc.addPage([612, 936]) // 8.5 x 13 inches in points
    const height = page.getHeight()

    function setCenter(text, font) {
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        return (page.getWidth() - textWidth) / 2
    }

    let position_of_all = Number(data.authentication.y) // Adjust this value as needed

    const headerTexts = [
        'Republic of the Philippines',
        'Province of Pangasinan',
        'MUNICIPALITY OF BAYAMBANG'
    ]

    headerTexts.forEach((text, index) => {
        const font = index === 3 ? fonts.bold : fonts.regular
        page.drawText(text, {
            x: setCenter(text, font),
            y: height - position_of_all - index * 15,
            size: fontSize,
            font: font,
            color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
        })
    })

    page.drawText('LOCAL CIVIL REGISTRY OFFICE', {
        x: setCenter('LOCAL CIVIL REGISTRY OFFICE', fonts.bold),
        y: height - position_of_all - 60,
        size: fontSize,
        font: fonts.bold,
        color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
    })

    const bodyTexts = [
        'THIS IS TO CERTIFY THAT THIS DOCUMENT WAS ISSUED BY A LOCAL CIVIL',
        'REGISTRY PERSONNEL WHO IS AUTHORIZED TO ISSUE THE SAME AND WHOSE ',
        'AUTHORITY WAS CONFIRMED BY THE CIVIL REGISTRAR GENERAL AND THE',
        'SIGNATURE OF THE LOCAL CIVIL REGISTRY PERSONNEL, WHICH APPEARS ON ',
        'THIS DOCUMENT, IS SIMILAR TO THE SIGNATURE SPECIMEN',
        'OFFICIALLY SUBMITTED TO AND FILED WITH THIS OFFICE.'
    ]

    bodyTexts.forEach((text, index) => {
        page.drawText(text, {
            x: setCenter(text, fonts.regular),
            y: height - position_of_all - 95 - index * 15,
            size: fontSize,
            font: fonts.regular,
            color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
        })
    })

    const dateVerifiedText = `DATE VERIFIED: ${format(new Date(data.date_filed), 'MM/dd/yyyy')}`
    const dateVerifiedX = setCenter(dateVerifiedText, fonts.regular)
    const dateVerifiedY = height - position_of_all - 190

    page.drawText(dateVerifiedText, {
        x: dateVerifiedX,
        y: dateVerifiedY,
        size: fontSize,
        font: fonts.regular,
        color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
    })

    // Draw underline for date_filed value
    const dateFiledValue = format(new Date(data.date_filed), 'MM/dd/yyyy')
    const dateFiledValueWidth = fonts.regular.widthOfTextAtSize(
        dateFiledValue,
        fontSize
    )
    const dateFiledValueX =
        dateVerifiedX +
        fonts.regular.widthOfTextAtSize('DATE VERIFIED: ', fontSize)

    page.drawLine({
        start: { x: dateFiledValueX + 1, y: dateVerifiedY - 2 },
        end: {
            x: dateFiledValueX + dateFiledValueWidth + 1,
            y: dateVerifiedY - 2
        },
        thickness: 1,
        color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
    })

    const verifiedByText = `VERIFIED BY: ${data.verified_by}`
    const verifiedByX = setCenter(verifiedByText, fonts.regular)
    const verifiedByY = height - position_of_all - 202

    page.drawText(verifiedByText, {
        x: verifiedByX,
        y: verifiedByY,
        size: fontSize,
        font: fonts.regular,
        color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
    })

    // Draw underline for verified_by value
    const verifiedByValue = data.verified_by
    const verifiedByValueWidth = fonts.regular.widthOfTextAtSize(
        verifiedByValue,
        fontSize
    )
    const verifiedByValueX =
        verifiedByX + fonts.regular.widthOfTextAtSize('VERIFIED BY: ', fontSize)

    page.drawLine({
        start: { x: verifiedByValueX + 1, y: verifiedByY - 2 },
        end: {
            x: verifiedByValueX + verifiedByValueWidth + 1,
            y: verifiedByY - 2
        },
        thickness: 1,
        color: rgb(0.12, 0.29, 0.49) // RGB color for #1F497D
    })

    // Draw Civil Registrar's Name (centered on page)
    const mcrText = data.civil_registrar
    const mcrTextWidth = fonts.bold.widthOfTextAtSize(mcrText, fontSize)
    const mcrTextX = setCenter(mcrText, fonts.bold) // Center of page

    page.drawText(mcrText, {
        x: mcrTextX,
        y: height - position_of_all - 250,
        size: fontSize,
        font: fonts.bold,
        color: rgb(0.12, 0.29, 0.49)
    })

    // Draw Civil Registrar's Position (centered under NAME)

    const mcrPositionText = data.civil_registrar_position
    const mcrPositionWidth = fonts.regular.widthOfTextAtSize(
        mcrPositionText,
        fontSize
    )
    const mcrPositionX = mcrTextX + mcrTextWidth / 2 - mcrPositionWidth / 2 // Center under name

    page.drawText(mcrPositionText, {
        x: mcrPositionX,
        y: height - position_of_all - 262,
        size: fontSize,
        font: fonts.regular,
        color: rgb(0.12, 0.29, 0.49)
    })

    // For Absence Section
    if (data.for_and_in_the_absence) {
        // "For and in the absence of:" label
        const absenceLabel = 'For and in the absence of:'
        const absenceLabelWidth = fonts.italic.widthOfTextAtSize(
            absenceLabel,
            fontSize
        )
        const absenceLabelX =
            mcrTextX + mcrTextWidth / 2 - absenceLabelWidth / 2

        page.drawText(absenceLabel, {
            x: absenceLabelX,
            y: height - position_of_all - 238, // Adjust Y position as needed
            size: fontSize,
            font: fonts.italic,
            color: rgb(0.12, 0.29, 0.49)
        })

        // Verified By Name
        const verifiedByName = data.absence_verified_by
        const verifiedByNameWidth = fonts.bold.widthOfTextAtSize(
            verifiedByName,
            fontSize
        )
        const verifiedByNameX =
            mcrTextX + mcrTextWidth / 2 - verifiedByNameWidth / 2

        page.drawText(verifiedByName, {
            x: verifiedByNameX,
            y: height - position_of_all - 304, // Adjust Y position as needed
            size: fontSize,
            font: fonts.bold,
            color: rgb(0.12, 0.29, 0.49)
        })

        // Verified By Position
        const verifiedByPos = data.absence_verifier_position
        const verifiedByPosWidth = fonts.regular.widthOfTextAtSize(
            verifiedByPos,
            fontSize
        )
        const verifiedByPosX =
            mcrTextX + mcrTextWidth / 2 - verifiedByPosWidth / 2

        page.drawText(verifiedByPos, {
            x: verifiedByPosX,
            y: height - position_of_all - 316, // Adjust Y position as needed
            size: fontSize,
            font: fonts.regular,
            color: rgb(0.12, 0.29, 0.49)
        })
    }
}

async function createRemarks(pdfDoc, data, page, fonts, fontSize) {
    page.drawText('REMARKS:', {
        x: 72,
        y: 276,
        size: fontSize,
        font: fonts.bold
    })

    const remarksWidth = fonts.bold.widthOfTextAtSize('REMARKS:', fontSize)
    if (data.is_reconstructed)
        page.drawText('Reconstructed Copy', {
            x: 72 + remarksWidth + 12,
            y: 276,
            size: fontSize,
            font: fonts.italic
        })


    if (data.is_other_remarks) {
        remark_annotation_maker(data, data.remarks, fonts, page, pdfDoc)
    }
}

/**
 * Remarks Formatter
 * 
 * @todo
 * double check this function since this is not fully tested
 * 
 */

async function remark_annotation_maker(config, data, fonts, page, pdfDoc) {
    let currentY = Number(config.remarks_config.y);
    const maxWidth = Number(config.remarks_config.width); // A4 width minus margins

    const words = [];
    for (const main_value of data.ops) {
        const attributes = main_value.attributes || {};
        const fontType =
            attributes.bold && attributes.italic
                ? fonts.boldItalic
                : attributes.bold
                    ? fonts.bold
                    : attributes.italic
                        ? fonts.italic
                        : fonts.regular


        const fontSize = Number(config.remarks_config.font);

        const insertText = main_value.insert || '';
        const lines = insertText.split('\n');
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            const splitWords = line.split(/\s+/).filter(word => word.length > 0);
            for (const wordText of splitWords) {
                words.push({
                    text: wordText,
                    font: fontType,
                    size: fontSize // Store font size with each word
                });
            }
            if (lineIdx < lines.length - 1) {
                words.push({ isNewLine: true });
            }
        }
    }

    let currentLine = [];
    let currentLineWidth = 0;
    let currentLineMaxFontSize = 0;

    for (const word of words) {
        if (word.isNewLine) {

            if (currentLine.length > 0) {
                const lineHeight = calculateLineHeight(currentLineMaxFontSize);
                drawLine(currentLine, Number(config.remarks_config.x), currentY, maxWidth, page, true);
                currentY -= lineHeight;
            } else {

                const lineHeight = calculateLineHeight(currentLineMaxFontSize || 12);
                currentY -= lineHeight;
            }


            currentLine = [];
            currentLineWidth = 0;
            currentLineMaxFontSize = 0;


            if (currentY < 72) {
                page = pdfDoc.addPage();
                currentY = page.getHeight() - 72;
            }
            continue;
        }

        const wordWidth = word.font.widthOfTextAtSize(word.text, word.size);
        const spaceWidth = word.font.widthOfTextAtSize(' ', word.size);


        let tentativeWidth = currentLineWidth +
            (currentLine.length > 0 ? spaceWidth : 0) +
            wordWidth;

        if (tentativeWidth > maxWidth) {

            const lineHeight = calculateLineHeight(currentLineMaxFontSize);
            drawLine(currentLine, Number(config.remarks_config.x), currentY, maxWidth, page, false);
            currentY -= lineHeight;

            if (currentY < 72) {
                page = pdfDoc.addPage();
                currentY = page.getHeight() - 72;
            }


            currentLine = [word];
            currentLineWidth = wordWidth;
            currentLineMaxFontSize = word.size;
        } else {

            if (currentLine.length > 0) currentLineWidth += spaceWidth;
            currentLine.push(word);
            currentLineWidth += wordWidth;
            if (word.size > currentLineMaxFontSize) {
                currentLineMaxFontSize = word.size;
            }
        }
    }


    if (currentLine.length > 0) {
        const lineHeight = calculateLineHeight(currentLineMaxFontSize);
        drawLine(currentLine, Number(config.remarks_config.x), currentY, maxWidth, page, true);
    }
}

// Helper function for dynamic line height
function calculateLineHeight(fontSize) {
    return fontSize * 1.2;
}

function drawLine(lineWords, xStart, y, maxWidth, page, isLastLine) {
    if (lineWords.length === 0) return;

    let totalWidth = 0;
    const spaceWidths = [];

    // Calculate widths with dynamic font sizes
    lineWords.forEach((word, index) => {
        const wordWidth = word.font.widthOfTextAtSize(word.text, word.size);
        totalWidth += wordWidth;
        if (index < lineWords.length - 1) {
            const spaceWidth = word.font.widthOfTextAtSize(' ', word.size);
            spaceWidths.push(spaceWidth);
            totalWidth += spaceWidth;
        }
    });

    // Calculate justification
    let extraSpace = 0;
    if (!isLastLine && spaceWidths.length > 0) {
        extraSpace = (maxWidth - totalWidth) / spaceWidths.length;
    }

    // Draw words
    let currentX = xStart;
    lineWords.forEach((word, index) => {
        if (index > 0) {
            const spaceAdjustment = spaceWidths[index - 1] + extraSpace;
            currentX += spaceAdjustment;
        }

        page.drawText(word.text, {
            x: currentX,
            y: y - (calculateLineHeight(word.size) - word.size), // Vertical alignment
            font: word.font,
            size: word.size
        });

        currentX += word.font.widthOfTextAtSize(word.text, word.size);
    });
}

/**
 * Paragraph Formatter
 * @FOR
 * @FORM_B
 * @FORM_C
 * 
 * @todo
 * double check this function, not fully tested
 */

function add_line_break(
    data,
    page,
    height,
    fontSize,
    timesRomanFont,
    timesRomanFontBold
) {
    const splitted = data.trim().split(' ')
    const filtered = []
    let currentArray = [] // Changeable kasi
    let totalWidthSoFar = 0
    let isBold = false
    let this_is_not_the_first = false

    for (const item of splitted) {
        const fontType = isBold ? timesRomanFontBold : timesRomanFont
        const widthofText =
            fontType.widthOfTextAtSize(
                item.replace('{{', '').replace('}}', ''),
                fontSize
            ) + 4

        item.includes('{{') && item.includes('}}')
            ? (isBold = false)
            : item.includes('{{')
                ? (isBold = true)
                : item.includes('}}')
                    ? (isBold = false)
                    : ''

        const tell_the_max_space =
            this_is_not_the_first || item !== 'archives' ? 415 : 415

        if (totalWidthSoFar + widthofText > tell_the_max_space) {
            filtered.push(currentArray)
            currentArray = []
            this_is_not_the_first = true
            totalWidthSoFar = 0 // Reset the width
        }

        if (item.includes('{{') && item.includes('}}')) {
            currentArray.push({
                data: item.replace('{{', '').replace('}}', ''),
                isBold: true,
                size: widthofText
            })
            totalWidthSoFar += widthofText
            this_is_not_the_first = true
            continue
        }

        if (item.includes('}}')) {
            currentArray.push({
                data: item.replace('{{', '').replace('}}', ''),
                isBold: true,
                size: widthofText
            })
            totalWidthSoFar += widthofText
            this_is_not_the_first = true
            continue
        }

        currentArray.push({
            data: item.replace('{{', '').replace('}}', ''),
            isBold: isBold,
            size: widthofText
        })
        totalWidthSoFar += widthofText
        this_is_not_the_first = true
    }

    if (currentArray.length > 0) {
        filtered.push(currentArray)
    }

    isBold = false
    this_is_not_the_first = false

    return filtered
}

function addBlanks(data) {
    const targetWidth = 451
    const minimumWidthToAddBlanks = 350

    let newData = []
    let this_is_not_the_first = false

    for (const items of data) {
        let totalWidth = items.reduce((acc, item) => acc + item.size, 0)
        const tell_the_max_space = this_is_not_the_first ? targetWidth : 415
        if (totalWidth <= minimumWidthToAddBlanks) {
            newData.push([...items])
            this_is_not_the_first = true
            continue
        }
        if (totalWidth <= tell_the_max_space) {
            let newLine = [...items]
            const remainingSpace = tell_the_max_space - totalWidth
            const blankItem = { data: ' ', isBold: false, size: 1 }
            const numberOfBlanks = Math.ceil(remainingSpace)

            for (let i = 0; i < numberOfBlanks; i++) {
                newLine.push(blankItem)
            }
            newData.push(newLine)
            this_is_not_the_first = true
        } else {
            newData.push([...items])
            this_is_not_the_first = true
        }
    }
    return newData
}

function distributeBlanks(data) {
    return data.map((array) => {
        const nonBlanks = array.filter((item) => item.data.trim() !== '')
        const blanks = array.filter((item) => item.data.trim() === '')
        const totalNonBlanks = nonBlanks.length
        const blanksPerGap = Math.floor(blanks.length / (totalNonBlanks - 1))
        const extraBlanks = blanks.length % (totalNonBlanks - 1)

        let distributedArray = []
        let blankIndex = 0

        nonBlanks.forEach((item, index) => {
            distributedArray.push(item)
            if (index < totalNonBlanks - 1) {
                for (let i = 0; i < blanksPerGap; i++) {
                    distributedArray.push(blanks[blankIndex++])
                }

                if (index < extraBlanks) {
                    distributedArray.push(blanks[blankIndex++])
                }
            }
        })

        return distributedArray
    })
}
