import { format } from 'date-fns'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
// import { esbuildVersion } from 'vite'

const fs = require('fs')
const path = require('path')

let filePath = ''
let doc = ''
let dataurl = ''

let marginLeft = 1
let marginTop = 0.9
let marginRight = 1
let marginBottom = 0.3

export async function createPdfForm(formData) {
    console.log(formData)
    if (['1A', '2A', '3A'].includes(formData.form_type)) {
        doc = new jsPDF({
            orientation: 'p',
            unit: 'in',
            format: [8.5, 13],
            putOnlyUsedFonts: true,
            floatPrecision: 16,
        })
    } else {
        doc = new jsPDF({
            orientation: 'p',
            unit: 'in',
            format: 'A4',
            putOnlyUsedFonts: true,
            floatPrecision: 16,
        })
    }

    doc.deletePage(1)
    doc.addPage()

    doc.setProperties({
        title: '',
        subject: '',
        author: 'Local Civil Registry',
        keywords: 'pdf, generated, amazing, one piece',
        creator: 'VBCRAS',
    })

    doc.viewerPreferences({
        HideToolbar: true,
        HideMenubar: true,
    })

    doc.addFont(
        path.resolve(__dirname, '../../resources/font/timesnewroman.ttf'),
        'Times New Roman',
        'normal',
        'Identity-H'
    )
    doc.addFont(
        path.resolve(__dirname, '../../resources/font/timesnewromanbold.ttf'),
        'Times New Roman',
        'bold'
    )
    doc.addFont(
        path.resolve(__dirname, '../../resources/font/timesnewromanitalic.ttf'),
        'Times New Roman',
        'italic'
    )
    doc.addFont(
        path.resolve(
            __dirname,
            '../../resources/font/timesnewromanbolditalic.ttf'
        ),
        'Times New Roman',
        'bolditalic'
    )

    doc.setFont('Times New Roman', 'normal')
    doc.setFontSize(12)

    await createHeader(formData)
    await whatTypeofForm(formData)
    certificate(formData)
    municipal_registrar(formData)
    verified_by(formData)
    billing_info(formData)
    note(formData)

    const save = await saving_details(formData)
    if (save) {
        return { success: true, filepath: filePath, dataurl: dataurl }
    }
}

async function createHeader(formData) {
    const leftLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_bayambang.png'
    )
    const rightLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_lcro.png'
    )

    const leftLogoData = fs.readFileSync(leftLogoPath)
    const rightLogoData = fs.readFileSync(rightLogoPath)

    // Text positioning for initial lines (adjust y-coordinate for multiple lines)

    const formTypeMap = {
        '1A': '(Birth - Available)',
        '1B': '(Birth - Not-Available)',
        '1C': '(Birth - Destroyed)',
        '2A': '(Death - Available)',
        '2B': '(Death - Not-Available)',
        '2C': '(Death - Destroyed)',
        '3A': '(Marriage - Available)',
        '3B': '(Marriage - Not-Available)',
        '3C': '(Marriage - Destroyed)',
    }
    const document_type = formTypeMap[formData.form_type] || ''

    // Position Adjustments

    const civil_form_x = Number(formData.civil_x)
    const civil_form_y = Number(formData.civil_y)

    const document_type_x = Number(formData.civil_x)
    const document_type_y = Number(formData.civil_y) + 0.2
    // Position Adjustments

    doc.text(
        `Civil Registry Form No. ${formData.form_type}`,
        civil_form_x,
        civil_form_y
    )
    doc.text(document_type, document_type_x, document_type_y)

    const linesToCenter = [
        'Republic of the Philippines',
        'Province of Pangasinan',
    ]

    // Calculate starting Y for centered text
    const textHeight = linesToCenter.length * (doc.getFontSize() / 72)
    let startY = marginTop + (1 - marginBottom - textHeight) / 2

    // Draw centered text
    for (const text of linesToCenter) {
        const textWidth = doc.getTextWidth(text)
        const x = (8.5 - textWidth) / 2
        doc.text(text, x, startY)
        startY += doc.getFontSize() / 72 + 0.05
    }

    // Bold and Centered Text
    doc.setFont('Times New Roman', 'bold')
    const boldLines = ['MUNICIPALITY OF BAYAMBANG']
    for (const text of boldLines) {
        const textWidth = doc.getTextWidth(text)
        const x = (8.5 - textWidth) / 2
        doc.text(text, x, startY)
        startY += doc.getFontSize() / 72 + 0.05
    }

    const lowercaseLine = 'LOCAL CIVIL REGISTRY OFFICE'
    const textWidth = doc.getTextWidth(lowercaseLine)
    const x = (8.5 - textWidth) / 2
    doc.text(lowercaseLine, x, startY + 0.3)

    const logoWidth = 1.09
    const logoHeight = 1.05
    const logoTopMargin = marginTop

    doc.addImage(
        leftLogoData,
        'PNG',
        marginLeft + 0.5,
        logoTopMargin,
        1.2,
        1.16
    )
    doc.addImage(
        rightLogoData,
        'PNG',
        8 - marginLeft - logoWidth,
        logoTopMargin,
        logoWidth,
        logoHeight
    )

    // Date Filed
    const currentDate = formData.date_filed
    doc.setFont('Times New Roman', 'normal')
    doc.setFontSize(12)
    const dateWidth = doc.getTextWidth(currentDate)
    //Date Filed Position Adjustments
    const date_filed_x = 8.5 - marginRight - dateWidth
    const date_filed_y = marginTop + 1.7
    doc.text(currentDate, date_filed_x, date_filed_y)

    // To Whom
    const towhom = 'TO WHOM IT MAY CONCERN:'
    doc.setFont('Times New Roman', 'bolditalic')
    doc.setFontSize(12)
    //To Whom Position Adjustments
    const towhom_x = marginLeft
    const towhom_y = marginTop + 2
    doc.text(towhom, towhom_x, towhom_y)
    doc.setFont('Times New Roman', 'normal')
}

function certificate(formData) {
    let inputValue = `This certificates is issued to **${formData.issued_to}** upon his/her request.`

    // Certificate Adjust Positions
    let certificate_x = Number(formData.certificate_x)
    let certificate_y = Number(formData.certificate_y)

    let lineHeight = 15

    doc.setFont('Times New Roman', 'normal')
    const arrayOfNormalAndBoldText = inputValue.split('**')
    arrayOfNormalAndBoldText.map((text, i) => {
        doc.setFont('Times New Roman', i % 2 === 0 ? 'normal' : 'bold')
        let textWidth = doc.getTextWidth(text)
        if (certificate_x + textWidth > 8.5) {
            certificate_x = (8.5 - doc.getTextWidth(inputValue)) / 2
            certificate_y += lineHeight
        }
        doc.text(text, certificate_x, certificate_y)
        certificate_x += textWidth
    })
}

function municipal_registrar(formData) {
    const name = formData.mcr
    const title = 'Municipal Civil Registrar'

    const nameWidth = doc.getTextWidth(name)
    const titleWidth = doc.getTextWidth(title)

    // Municipal Position Adjustments
    const municipal_x = 2 + (8.5 - nameWidth) / 2
    const municipal_y = 9 + 1

    // Position Adjustments
    const mun_position_x = 2 + (8.5 - titleWidth) / 2
    const mun_position_y = 9 + 1.2

    doc.setFontSize(12)
    doc.setFont('Times New Roman', 'bold')
    doc.text(name, municipal_x, municipal_y)

    doc.setFont('Times New Roman', 'italic')
    doc.text(title, mun_position_x, mun_position_y)
}

function verified_by(formData) {
    // Verified Postion Adjustments
    const verified_by_y = 9 + 1.4
    const verified_by_x = 1

    doc.setFont('Times New Roman', 'italic')
    doc.text('Verified by:', verified_by_x, verified_by_y)

    const name = formData.verified_by
    const title = formData.position

    const nameWidth = doc.getTextWidth(name)
    const titleWidth = doc.getTextWidth(title)

    // User Name Position Adjustments
    const user_name_x = (8.5 - nameWidth) / 2 - 1
    const user_name_y = 9 + 1.4 + 0.3

    // User Position Position Adjustments
    const user_position_x = (8.5 - titleWidth) / 2 - 1
    const user_position_y = 9 + 1.4 + 0.5

    doc.setFontSize(12)
    doc.setFont('Times New Roman', 'bold')
    doc.text(name, user_name_x, user_name_y)

    doc.setFont('Times New Roman', 'italic')
    doc.text(title, user_position_x, user_position_y)
}

function billing_info(formData) {
    // Billing Position Adjustments
    const billing_y = 9 + 2.3
    const billing_x = 1

    doc.autoTable({
        body: [
            ['Amount Paid', ':', formData.amount_paid],
            ['O.R. Number', ':', formData.or_number],
            ['Date Paid', ':', formData.date_paid],
        ],
        theme: 'plain', // You can choose other themes like 'grid'
        headStyles: { fillColor: [255, 255, 255] }, // White header background
        columnStyles: {
            0: {
                font: 'Times New Roman',
                fontStyle: 'normal',
                cellWidth: 1.2,
                halign: 'left',
                fontSize: 12,
                valign: 'center',
                cellPadding: { left: 0, right: 0, top: 0, bottom: 0 },
            },
            1: {
                font: 'Times New Roman',
                fontStyle: 'normal',
                cellWidth: 0.2,
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                cellPadding: { left: 0, right: 0, top: 0, bottom: 0 },
            },
            2: {
                cellWidth: 4,
                font: 'Times New Roman',
                fontStyle: 'normal',
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                cellPadding: { left: 0, right: 0, top: 0, bottom: 0 },
            },
        },
        startY: billing_y,
        tableWidth: 'auto',
        margin: { left: billing_x },
    })
}

function note(formData) {
    // Note Position Adjustments
    const note_y = 9 + 3.5
    const note_x = 1

    const note = 'Note:'
    doc.setFont('Times New Roman', 'bold')
    const note_width = doc.getTextWidth(note)
    doc.text(note, note_x, note_y)

    const text =
        ' A mark, erasure or alteration of any entry invalidates this certification.'
    doc.setFont('Times New Roman', 'normal')
    doc.text(text, note_x + note_width, note_y)
}

async function saving_details(formData) {
    if (formData.purpose === 'edit') {
        dataurl = doc.output('dataurlstring')
        return true
    }

    const date = new Date()
    const formTypeMap = {
        '1A': 'Form 1A',
        '1B': 'Form 1B',
        '1C': 'Form 1C',
        '2A': 'Form 2A',
        '2B': 'Form 2B',
        '2C': 'Form 2C',
        '3A': 'Form 3A',
        '3B': 'Form 3B',
        '3C': 'Form 3C',
    }
    const document_type = formTypeMap[formData.form_type] || ''

    var folderCreation = `C:/VBCRAS/${
        date.getFullYear() + '/' + 'Forms/' + document_type
    }/`

    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }

    doc.save(folderCreation + formData.name_of + '.pdf')
    filePath = folderCreation + formData.name_of + '.pdf'
    return true
}

async function whatTypeofForm(formData) {
    if (['1A', '2A', '3A'].includes(formData.form_type)) {
        create_for_A(formData)
    } else if (['1B', '2B', '3B'].includes(formData.form_type)) {
        create_for_B(formData)
    } else if (['1C', '2C', '3C'].includes(formData.form_type)) {
        console.log(formData.form_type)
    }
}

//Creating the Main Body for Forms A (1A, 2A, 3A)

function create_for_A(formData) {
    const type = formData.form_type.includes('A')
        ? 'birth'
        : formData.form_type.includes('B')
          ? 'death'
          : formData.form_type.includes('C')
            ? 'marriage'
            : ''
    const typeofdocument = type.charAt(0).toUpperCase() + type.slice(1)

    doc.setFont('Times New Roman', 'normal')
    doc.setFontSize(12)
    doc.text(
        `We certify that among others the following facts of ${type} appear in our Register of`,
        marginLeft + 0.63,
        marginTop + 2.5
    )

    doc.text(
        `${typeofdocument} on page ________ book number ________. `,
        marginLeft,
        marginTop + 2.8
    )
    doc.setFont('Times New Roman', 'bold')
    doc.text(formData.book_number, marginLeft + 1.3, marginTop + 2.8)
    doc.text(formData.page_number, marginLeft + 3, marginTop + 2.8)
    doc.setFont('Times New Roman', 'normal')

    let thebody = []

    if (formData.form_type === '1A') {
        thebody = [
            ['Registry Number', ':', formData.registry_number],
            ['Date of registration', ':', formData.date_registration],
            ['Name of Child', ':', formData.name_of],
            ['Sex', ':', formData.sex],
            ['Date of birth', ':', formData.date_of],
            ['Place of birth', ':', formData.place_of],
            ['Name of Mother', ':', formData.name_of_mother],
            ['Citizenship of Mother', ':', formData.citizenship_mother],
            ['Name of Father', ':', formData.name_of_father],
            ['Citizenship of Father', ':', formData.citizenship_father],
            ['Date of Marriage', ':', formData.date_marriage],
            [
                'Place of marriage of parents',
                ':',
                formData.place_of_marriage_parents,
            ],
        ]
    } else if (formData.form_type === '2A') {
        thebody = [
            ['Registry Number', ':', formData.registry_number],
            ['Date of registration', ':', formData.date_registration],
            ['Name of Deceased', ':', formData.name_of],
            ['Sex', ':', formData.sex],
            ['Age', ':', formData.age],
            ['Civil Status', ':', formData.civil_status],
            ['Citizenship', ':', formData.citizenship],
            ['Date of Death', ':', formData.date_of],
            ['Place of Death', ':', formData.place_of],
            ['Cause of Death', ':', formData.cause_of_death],
        ]
    }

    // Info List Position Adjustments

    const info_x = Number(formData.info_x)
    const info_y = Number(formData.info_y)

    doc.autoTable({
        body: thebody,
        theme: 'plain',
        headStyles: { fillColor: [255, 255, 255] },
        columnStyles: {
            0: {
                font: 'Times New Roman',
                fontStyle: 'normal',
                cellWidth: 2.2,
                halign: 'left',
                fontSize: 12,
                minCellHeight: 0.39,
                valign: 'center',
            },
            1: {
                font: 'Times New Roman',
                fontStyle: 'normal',
                cellWidth: 0.1,
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                minCellHeight: 0.39,
                cellPadding: { left: 0, right: 0 },
            },
            2: {
                cellWidth: 6,
                font: 'Times New Roman',
                fontStyle: 'bold',
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                minCellHeight: 0.39,
                cellPadding: { left: 0, right: 0 },
            },
        },
        startY: info_y,
        tableWidth: 'auto',
        margin: { left: info_x },
    })
}

function create_for_B(formData) {
    const TEXT_FOR_B = `   We certify that this office has no record of birth of **EMERITO CURAMENG CASTILLO** who is alleged to have been born on **September 22, 1953** in this municipality, of parents **Romulo Mamaril Castillo Sr** and **Felicidad Frias Curameng** Hence, we cannot issue, as requested, a true copy of his/her Certificate of Live Birth or transcription from the Register of Births.`

    const isBoldOpen = (arrayLength, valueBefore = false) => {
        const isEven = arrayLength % 2 === 0
        const result = valueBefore !== isEven
        return result
    }

    let startX = 1
    let startY = 3.5
    const fontSize = 12
    const lineSpacing = 0.3

    const inputValue = TEXT_FOR_B
    const endX = 6.44
    let textMap = doc.splitTextToSize(inputValue, endX)
    const startXCached = startX
    let boldOpen = false

    textMap.map((text, i) => {
        if (text) {
            // Split text into words (includes bold delimiters)
            const allWords = text.split(/\s+/)

            let xOffset = startX
            let totalTextWidth = 0
            for (let word of allWords) {
                totalTextWidth += doc.getTextWidth(word)
            }

            const numSpaces = allWords.length - 1
            let extraSpacePerWord = 0
            if (i !== textMap.length - 1 && numSpaces > 0) {
                extraSpacePerWord = (endX - totalTextWidth) / numSpaces
            }

            allWords.map((word, j) => {
                // Determine if the word starts or ends with a bold delimiter
                const startsWithBold = word.startsWith('**')
                const endsWithBold = word.endsWith('**')
                const wordWithoutDelimiters = word.replace(/\*\*/g, '')

                // Set font based on boldness
                if (startsWithBold || (boldOpen && !endsWithBold)) {
                    doc.setFont('Times New Roman', 'bold')
                } else {
                    doc.setFont('Times New Roman', 'normal')
                }

                doc.text(wordWithoutDelimiters, xOffset, startY)
                xOffset += doc.getTextWidth(word) + extraSpacePerWord

                // Update boldOpen if a bold delimiter was encountered
                if (startsWithBold) {
                    boldOpen = !boldOpen
                }
            })

            startX = startXCached
            startY += lineSpacing
        }
    })

    const ANOTHER_TEXT =
        '   We also certify that the records of births for the year 1953 are still intact in the archives of this office.'
    const splitted_another = doc.splitTextToSize(ANOTHER_TEXT, 6.44)
    doc.text(splitted_another, 1, 5.3, 'justify')
}
