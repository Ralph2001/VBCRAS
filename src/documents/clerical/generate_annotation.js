import { degrees, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const path = require('path')
const fs = require('fs')

export async function CreateAnnotated(user, formData) {
    console.log(formData)

    let pdfBytes = null
    const PDFFILE_PATH = user + '\\' + formData.filepath

    console.log('run')
    console.log(PDFFILE_PATH)

    // PDF Read as Bytes
    const buffer = fs.readFileSync(PDFFILE_PATH)
    const certificate_live_birth_bytes = buffer.buffer

    const firstDoc = await PDFDocument.load(certificate_live_birth_bytes)

    const pdfDoc = await PDFDocument.create()

    pdfDoc.setTitle('Form 102 with Annotation for - ', {
        showInWindowTitleBar: true,
    })
    pdfDoc.setAuthor('VBCRAS')
    pdfDoc.setSubject('Annotation')
    pdfDoc.setKeywords(['amazing', 'one piece', 'pdf generate'])
    pdfDoc.setProducer('VBCRAS')
    pdfDoc.setCreator('made by villanuevaralph2001@gmail.com')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())

    const [embeddedPage] = await pdfDoc.embedPdf(firstDoc, [0])

    const scale = Number(formData.form_scale)
    const x_position = Number(formData.form_x)
    const y_position = Number(formData.form_y)


    const annotation_x = Number(formData.annotation_x)
    const annotation_y = Number(formData.annotation_y)
    const annotation_angle = Number(formData.annotation_angle)
    const annotation_font = Number(formData.annotation_font)

    const useAnnotationDocument = embeddedPage.scale(scale)
    const page = pdfDoc.addPage([612, 936])

    page.drawPage(embeddedPage, {
        ...useAnnotationDocument,
        x: page.getWidth() / 2 - useAnnotationDocument.width / x_position,
        y: page.getHeight() - useAnnotationDocument.height - y_position,
    })

    const rotationAngle = page.getRotation().angle;

    // let maxWidth = 0
    // if (rotationAngle === 0) {
    //     maxWidth = 930
    // } else {
    //     maxWidth = 606
    // }


    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(formData.annotation, {
        x: annotation_x,
        y: height / 2 + annotation_y,
        size: annotation_font,
        rotate: degrees(annotation_angle),
        maxWidth: 930,
        lineHeight: 14
    })


    // const [firstDonorPage] = await pdfDoc.copyPages(firstDoc, [0])
    // pdfDoc.addPage(firstDonorPage)
    // // Load PDF
    // const certificate_live_birth_Doc = await PDFDocument.load(
    //     certificate_live_birth_bytes
    // )

    // // Create New PDF
    // const pdfDoc = await PDFDocument.create()

    // // Source
    // const sourcePdfPage = certificate_live_birth_Doc.getPages()[0]

    // // Embedded
    // const embeddedPage = await pdfDoc.embedPage(
    //     sourcePdfPage,

    //     // Clip a section of the source page so that we only embed part of it
    //     { left: 100, right: 450, bottom: 330, top: 570 },

    //     // Translate all drawings of the embedded page by (10, 200) units
    //     [1, 0, 0, 1, 10, 200]
    // )

    //   Save Page

    pdfBytes = await pdfDoc.saveAsBase64()

    return { status: true, pdfbase64: pdfBytes }
}
