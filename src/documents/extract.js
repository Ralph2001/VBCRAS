import { PDFDocument } from 'pdf-lib'

export async function extractPageRange(base64, from, to) {
    const pdfBytes = Buffer.from(base64, 'base64')
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(pdfDoc, [...Array(to - from + 1).keys()].map(i => i + from))
    copiedPages.forEach((page) => newPdf.addPage(page))

    const newPdfBytes = await newPdf.save()
    return Buffer.from(newPdfBytes).toString('base64')
}
