import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const fs = require('fs')
const path = require('path')

let doc = new jsPDF({
    orientation: 'p',
    unit: 'in',
    format: [8.5, 13],
    putOnlyUsedFonts: true,
    floatPrecision: 16,
})

let marginLeft = 1
let marginTop = 0.9
let marginRight = 0.3
let marginBottom = 0.3

export async function createPdfForm() {
    // Set margins directly in the constructor

    // Create a single jsPDF instance with margins

    doc.addFont(path.resolve(__dirname,'../../resources/font/timesnewroman-normal.js'),'Times New Roman', 'normal')
    doc.addFont(path.resolve(__dirname,'../../resources/font/timesnewromanbold-bold.js'),'Times New Roman', 'bold')
    doc.addFont(path.resolve(__dirname,'../../resources/font/timesnewromanitalic-italic.js'),'Times New Roman', 'italic')
    doc.addFont(path.resolve(__dirname,'../../resources/font/timesnewromanbolditalic-bolditalic.js'),'Times New Roman', 'bolditalic')





    doc.setFont('Times New Roman')
    doc.setFontSize(12)

    const leftLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_bayambang.png'
    )
    const rightLogoPath = path.resolve(
        __dirname,
        '../../resources/images/logo_lcro.png'
    )

    console.log(doc.getFontList())

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

    const currentDate = new Date().toLocaleDateString()
    doc.setFont('Times New Roman')
    doc.setFontSize(12)
    const dateWidth = doc.getTextWidth(currentDate)
    const dateX = 7.8 - marginRight - dateWidth
    const dateY = marginTop + 1.5
    doc.text(currentDate, dateX, dateY)

    const towhom = 'TO WHOM IT MAY CONCERN:'
    doc.setFont('Times New Roman', 'bolditalic')
    doc.setFontSize(12)
    doc.text(towhom, marginLeft, marginTop + 2)
    doc.setFont('Times New Roman')

    await whatTypeofForm()

    doc.save('a4.pdf')
}

async function whatTypeofForm() {
    // We certify that among others the following facts of birth appear in our Register of Births

    doc.setFont('Times New Roman')
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
    doc.text('24', marginLeft + 1.25, marginTop + 2.8)
    doc.text('23', marginLeft + 2.9, marginTop + 2.8)

    doc.autoTable({
        body: [
            ['Registry Number', ':', '2024-23'],
            ['Date of registration', ':', 'May 16, 2001'],
            ['Name of Child', ':', 'RALPH ADVINCULA VILLANUEVA'],
            ['Sex', ':', 'Male'],
            ['Date of birth', ':', 'Alcala, Pangasinan'],
            [
                'Place of birth',
                ':',
                'Nuestro Señor Sto. Niño General Hospital, Bayambang, Pangasinan',
            ],
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
                cellWidth: 2,
                halign: 'left',
                fontSize: 12,
                valign: 'center',
            },
            1: {
                font: 'Times New Roman',
                cellWidth: 0.1,
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                cellPadding: { left: 0, right: 0 },
            },
            2: {
                cellWidth: 5,
                font: 'Times New Roman',
                fontStyle: 'bolditalic',
                halign: 'left',
                valign: 'center',
                fontSize: 12,
                cellPadding: { left: 0, right: 0 },
            },
        },
        startY: marginTop + 3.1,
        tableWidth: 'auto',
        margin: { left: 1.2 },
    })
}
