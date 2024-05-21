import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const fs = require('fs')
const path = require('path')

let doc = new jsPDF({
    orientation: 'p',
    unit: 'in',
    format: [8.5, 13],
    putOnlyUsedFonts: true,
})

doc.setProperties({
    title: 'Form 1A (Abroad) - Ralph Advincula Villanueva',
    subject: 'Form 1A',
    author: 'Local Civil Registry',
    keywords: 'pdf, generated, amazing',
    creator: 'VBCRAS',
})

let marginLeft = 1
let marginTop = 0.9
let marginRight = 1
let marginBottom = 0.3

export async function createPdfForm() {
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
    doc.text('Civil Registry Form No. 1A', marginLeft - 0.6, marginTop - 0.4)
    doc.text('(Birth - Available)', marginLeft - 0.6, marginTop - 0.2)

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

    const lowercaseLine = 'LOCAL CIVIL REGISTRY'
    const textWidth = doc.getTextWidth(lowercaseLine)
    const x = (8.5 - textWidth) / 2
    doc.text(lowercaseLine, x, startY + 0.3)

    const logoWidth = 1.09 // Adjust as needed
    const logoHeight = 1.05 // Adjust as needed
    const logoTopMargin = marginTop // Adjust to position the logos correctly

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

    const currentDate = 'May 16, 2001'
    doc.setFont('Times New Roman', 'normal')
    doc.setFontSize(12)
    const dateWidth = doc.getTextWidth(currentDate)
    const dateX = 8.5 - marginRight - dateWidth
    const dateY = marginTop + 1.7
    doc.text(currentDate, dateX, dateY)

    const towhom = 'TO WHOM IT MAY CONCERN:'
    doc.setFont('Times New Roman', 'bolditalic')
    doc.setFontSize(12)
    doc.text(towhom, marginLeft, marginTop + 2)
    doc.setFont('Times New Roman', 'normal')

    await whatTypeofForm()
    certificate()
    municipal_registrar()
    verified_by()
    billing_info()
    note()

    doc.save('a4.pdf')
}

async function whatTypeofForm() {
    // We certify that among others the following facts of birth appear in our Register of Births

    doc.setFont('Times New Roman', 'normal')
    doc.setFontSize(12)
    doc.text(
        'We certify that among others the following facts of birth appear in our Register of',
        marginLeft + 0.63,
        marginTop + 2.5
    )

    doc.text(
        'Births on page ________ book number ________. ',
        marginLeft,
        marginTop + 2.8
    )
    doc.setFont('Times New Roman', 'bold')
    doc.text('24', marginLeft + 1.3, marginTop + 2.8)
    doc.text('23', marginLeft + 3, marginTop + 2.8)
    doc.setFont('Times New Roman', 'normal')

    doc.autoTable({
        body: [
            ['Registry Number', ':', '2024-23'],
            ['Date of registration', ':', 'May 16, 2001'],
            ['Name of Child', ':', 'RALPH ADVINCULA VILLANUEVA'],
            ['Sex', ':', 'Male'],
            ['Date of birth', ':', 'Alcala, Pangasinan'],
            ['Place of birth', ':', 'Anulid, Alcala, Pangasinan'],
            ['Name of Mother', ':', 'Anita A. Villanueva'],
            ['Citizenship of Mother', ':', 'Filipino'],
            ['Name of Father', ':', 'Rolando M. Villanueva'],
            ['Citizenship of Father', ':', 'Filipino'],
            ['Date of Marriage', ':', 'December 28, 1990'],
            ['Place of marriage of parents', ':', 'Alcala, Pangasinan'],
        ],
        theme: 'plain', // You can choose other themes like 'grid'
        headStyles: { fillColor: [255, 255, 255] }, // White header background
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
        startY: marginTop + 3.1,
        tableWidth: 'auto',
        margin: { left: 1.4 },
    })
}

function certificate() {
    let inputValue =
        'This certificates is issued to **Ralph A. Villanueva** upon his/her request.'
    let startX = (8.5 - doc.getTextWidth(inputValue)) / 2
    let startY = marginTop + 8.2
    let lineHeight = 15

    doc.setFont('Times New Roman', 'normal')
    const arrayOfNormalAndBoldText = inputValue.split('**')
    arrayOfNormalAndBoldText.map((text, i) => {
        doc.setFont('Times New Roman', i % 2 === 0 ? 'normal' : 'bold')
        let textWidth = doc.getTextWidth(text)
        if (startX + textWidth > 8.5) {
            startX = (8.5 - doc.getTextWidth(inputValue)) / 2
            startY += lineHeight
        }

        doc.text(text, startX, startY)
        startX += textWidth
    })
}

function municipal_registrar() {
    const name = 'ISMAEL D. MALICDEM, JR.'
    const title = 'Municipal Civil Registrar'

    const nameWidth = doc.getTextWidth(name)
    const titleWidth = doc.getTextWidth(title)

    const nameStartX = 2 + (8.5 - nameWidth) / 2
    const titleStartX = 2 + (8.5 - titleWidth) / 2

    doc.setFontSize(12)
    doc.setFont('Times New Roman', 'bold')
    doc.text(name, nameStartX, 9 + 1)

    doc.setFont('Times New Roman', 'italic')
    doc.text(title, titleStartX, 9 + 1.2)
}

function verified_by() {
    let y_position = 9 + 1.4

    doc.setFont('Times New Roman', 'italic')
    doc.text('Verified by:', 1, y_position)

    const name = 'ERIKA JOYCE B. PARAGAS'
    const title = 'Administrative Aide II'

    const nameWidth = doc.getTextWidth(name)
    const titleWidth = doc.getTextWidth(title)

    const nameStartX = (8.5 - nameWidth) / 2
    const titleStartX = (8.5 - titleWidth) / 2

    doc.setFontSize(12)
    doc.setFont('Times New Roman', 'bold')
    doc.text(name, nameStartX - 1, y_position + 0.3)

    doc.setFont('Times New Roman', 'italic')
    doc.text(title, titleStartX - 1, y_position + 0.5)
}

function billing_info() {
    let position = 9 + 2.3

    doc.autoTable({
        body: [
            ['Amount Paid', ':', 'PHP 1,200.00'],
            ['O.R. Number', ':', '916591123'],
            ['Date Paid', ':', 'May 16, 2001'],
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
        startY: position,
        tableWidth: 'auto',
        margin: { left: 1 },
    })
}

function note() {
    let position = 9 + 3.5

    const note = 'Note:'
    doc.setFont('Times New Roman', 'bold')
    const note_width = doc.getTextWidth(note)
    doc.text(note, 1, position)

    const text =
        ' A mark, erasure or alteration of any entry invalidates this certification.'
    doc.setFont('Times New Roman', 'normal')
    doc.text(text, 1 + note_width, position)
}

function adpdo() {
    const inputValue = document.getElementById('multiline').value
    const endX = 360
    // red marks to make textwidth visible
    // doc.setDrawColor('#ff0000');
    // doc.setLineWidth(1);
    // doc.line(startX, startY - 10, startX, startY + 200);
    // doc.line(endX, startY - 10, endX, startY + 200);
    let textMap = doc.splitTextToSize(inputValue, endX)

    const startXCached = startX
    let boldOpen = false
    textMap.map((text, i) => {
        if (text) {
            const arrayOfNormalAndBoldText = text.split('**')
            const boldStr = 'bold'
            const normalOr = 'normal'
            arrayOfNormalAndBoldText.map((textItems, j) => {
                doc.setFontType(boldOpen ? normalOr : boldStr)
                if (j % 2 === 0) {
                    doc.setFontType(boldOpen ? boldStr : normalOr)
                }
                doc.text(textItems, startX, startY)
                startX = startX + doc.getStringUnitWidth(textItems) * fontSize
            })
            boldOpen = isBoldOpen(arrayOfNormalAndBoldText.length, boldOpen)
            startX = startXCached
            startY += lineSpacing
        }
    })

    const isBoldOpen = (arrayLength, valueBefore = false) => {
        const isEven = arrayLength % 2 === 0
        const result = valueBefore !== isEven

        return result
    }
}

// function certificate() {
//     const text = 'This certification is issued to'
//     const nameToBold = 'Ralph A. Villanueva'
//     const closingText = 'upon his/her request.'

//     // Calculate total text width (including spaces)
//     const totalTextWidth =
//         doc.getTextWidth(text) +
//         doc.getTextWidth(nameToBold) +
//         doc.getTextWidth(closingText) +
//         1 // Smaller spacing adjustment

//     // Available width for text
//     const availableWidth = 8.5

//     // Calculate centering offset
//     const centerOffset = (availableWidth - totalTextWidth) / 2

//     // Start X position (centered)
//     const startX = 1 + centerOffset // Slightly adjust to the left

//     const startY = marginTop + 8.2 // Your original Y position

//     // Write the text (centered)
//     doc.setFont('Times New Roman', 'normal')
//     doc.text(text, startX, startY)

//     doc.setFont('Times New Roman', 'bold')
//     doc.text(nameToBold, startX + doc.getTextWidth(text) + 0.1, startY) // Smaller spacing adjustment

//     doc.setFont('Times New Roman', 'normal')
//     doc.text(
//         closingText,
//         startX + doc.getTextWidth(text) + doc.getTextWidth(nameToBold),
//         startY
//     ) // Smaller spacing adjustment
// }
