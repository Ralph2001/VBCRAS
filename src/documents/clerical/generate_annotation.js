import { degrees, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const path = require('path')
const fs = require('fs')

export async function CreateAnnotated(user, formData) {

    let pdfBytes = null
    const PDFFILE_PATH = user + '\\' + formData.filepath

    // PDF Read as Bytes
    const buffer = fs.readFileSync(PDFFILE_PATH)
    const certificate_live_birth_bytes = buffer.buffer

    const firstDoc = await PDFDocument.load(certificate_live_birth_bytes)

    const pdfDoc = await PDFDocument.create()

    // Fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)



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



    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()


    // firstPage.drawText(formData.annotation, {
    //     x: annotation_x,
    //     y: height / 2 + annotation_y,
    //     size: annotation_font,
    //     font: timesRomanFont,
    //     rotate: degrees(annotation_angle),
    //     maxWidth: 920,
    //     lineHeight: 14
    // })

    // firstPage.drawText('Pursuant to the decision rendered by', {
    //     x: annotation_x,
    //     y: height / 2 + annotation_y,
    //     size: annotation_font,
    //     font: timesRomanFont,
    //     rotate: degrees(annotation_angle),
    //     lineHeight: 14
    // })

    // const widthofFirst = timesRomanFont.widthOfTextAtSize('Pursuant to the decision rendered by', 12)

    // firstPage.drawText('MCR ISMAEL D. MALICDEM, JR.', {
    //     x: annotation_x,
    //     y: height / 2 + annotation_y - widthofFirst - 3,
    //     size: annotation_font,
    //     font: timesRomanFontBold,
    //     rotate: degrees(annotation_angle),
    //     lineHeight: 14
    // })



    let splitedwidth = 0
    let x_value = 600

    const split = formData.annotation.split(' ');
    const filtered = [];
    let isBold = false

    for (let index = 0; index < split.length; index++) {
        if (split[index].startsWith('<p>')) {
            isBold = false
        }
        else if (split[index].endsWith('</p>')) {
            isBold = false
        }
        else if (split[index].startsWith('<strong>' || split[index].endsWith('<strong>'))) {
            isBold = true
        }
        else if (split[index].endsWith('</strong>')) {
            split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
            filtered.push({ text: split[index], isBold: true })
            isBold = false
            continue;
        }
        else if (split[index].startsWith('</strong>')) {
            split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
            filtered.push({ text: split[index], isBold: false })
            isBold = false
            continue;
        }
        split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
        filtered.push({ text: split[index], isBold: isBold })
    }

    console.log(filtered)

    for (let index = 0; index < filtered.length; index++) {

        if (splitedwidth > 800) {
            x_value += -14
        }
        if (splitedwidth > 800) {
            splitedwidth = 0
        }


        firstPage.drawText(filtered[index].text, {
            x: x_value,
            y: height / 2 + annotation_y - splitedwidth,
            size: 12,
            font: filtered[index].isBold ? timesRomanFontBold : timesRomanFont,
            rotate: degrees(annotation_angle),
            lineHeight: 14
        })
        let fontStyle = filtered[index].isBold ? timesRomanFontBold : timesRomanFont
        splitedwidth += fontStyle.widthOfTextAtSize(filtered[index].text, 12) + 3

    }


    pdfBytes = await pdfDoc.saveAsBase64()

    return { status: true, pdfbase64: pdfBytes }
}
