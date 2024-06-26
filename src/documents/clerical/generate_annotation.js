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
    let isBold = false

    const split = formData.annotation.split(' ');
    const filtered = [];
    let currentArray = [];
    let totalWidthSoFar = 0;
    const blankSpaceWidth = 1; // Get the width of a single space

    for (let index = 0; index < split.length; index++) {
        const text = split[index]; // Use a descriptive variable name for clarity
        const textWidth = timesRomanFont.widthOfTextAtSize(text, 12);

        // Check if adding the current text would exceed or exactly reach the limit
        if (totalWidthSoFar + textWidth >= 800) {
            // If it exceeds or reaches the limit, calculate remaining space and add blanks
            const remainingSpace = 800 - totalWidthSoFar;

            // Ensure at least one space is added even if remainingSpace < blankSpaceWidth
            const numBlanks = Math.max(1, Math.floor(remainingSpace / blankSpaceWidth));

            // Push current array and add remaining blanks as separate entries
            filtered.push(currentArray);
            for (let i = 0; i < numBlanks; i++) {
                currentArray.push({ text: ' ', isBold: false, size: blankSpaceWidth });
            }

            currentArray = []; // Reset the current array for the next line
            totalWidthSoFar = 0; // Reset the total width for the next line
        }

        // Push the current text with its details
        currentArray.push({ text, isBold: false, size: textWidth });
        totalWidthSoFar += textWidth;
    }

    if (currentArray.length > 0) {
        filtered.push(currentArray);
    }






    // for (const line of filtered) {
    //     let totalwidth = 0
    //     for (const item of line) {
    //         totalwidth += item.size
    //     }
    //     console.log(`Total width of: ${totalwidth}`)
    //     totalwidth = 0
    // }

    // console.log(filtered)

    function distributeBlanks(data) {
        return data.map(array => {
          // Extract non-blank and blank items
          const nonBlanks = array.filter(item => item.text.trim() !== '');
          const blanks = array.filter(item => item.text.trim() === '');
      
          // Calculate the number of non-blank items
          const totalNonBlanks = nonBlanks.length;
      
          // Calculate the number of blanks to distribute between each pair of non-blank items
          const blanksPerGap = Math.floor(blanks.length / (totalNonBlanks - 1));
          const extraBlanks = blanks.length % (totalNonBlanks - 1);
      
          // Distribute blanks
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

      const sortedData = distributeBlanks(filtered)
          for (const line of sortedData) {
        let totalwidth = 0
        for (const item of line) {
            totalwidth += item.size
        }
        console.log(`Total width of: ${totalwidth}`)
        totalwidth = 0
    }
      console.log(sortedData)
    // Loop through filtered array and calculate total sizes
    for (const line of sortedData) {

        for (const item of line) {
            firstPage.drawText(item.text, {
                x: x_value,
                y: height / 2 + annotation_y - splitedwidth,
                size: 12,
                font: timesRomanFont,
                rotate: degrees(annotation_angle),
                lineHeight: 14
            })
            splitedwidth += item.size + 3
        }
        x_value += -14
        splitedwidth = 0

    }

















    // if (split[index].startsWith('<p>')) {
    //     isBold = false
    // }
    // else if (split[index].endsWith('</p>')) {
    //     isBold = false
    // }
    // else if (split[index].startsWith('<strong>' || split[index].endsWith('<strong>'))) {
    //     isBold = true
    // }
    // else if (split[index].endsWith('</strong>')) {
    //     split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
    //     filtered.push({ text: split[index], isBold: true })
    //     isBold = false
    //     continue;
    // }
    // else if (split[index].startsWith('</strong>')) {
    //     split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
    //     filtered.push({ text: split[index], isBold: false })
    //     isBold = true
    //     continue;
    // }
    // split[index] = split[index].replace('<p>', '').replace('</p>', '').replace('<strong>', '').replace('</strong>', '');
    // filtered.push({ text: split[index], isBold: isBold })
    // }

    // console.log(filtered)

    // for (let index = 0; index < filtered.length; index++) {
    //     if (splitedwidth > 800) {
    //         x_value += -14
    //     }
    //     if (splitedwidth > 800) {
    //         splitedwidth = 0
    //     }
    //     firstPage.drawText(filtered[index].text, {
    //         x: x_value,
    //         y: height / 2 + annotation_y - splitedwidth,
    //         size: 12,
    //         font: filtered[index].isBold ? timesRomanFontBold : timesRomanFont,
    //         rotate: degrees(annotation_angle),
    //         lineHeight: 14
    //     })
    //     let fontStyle = filtered[index].isBold ? timesRomanFontBold : timesRomanFont
    //     splitedwidth += fontStyle.widthOfTextAtSize(filtered[index].text, 12) + 3

    // }


    pdfBytes = await pdfDoc.saveAsBase64()

    return { status: true, pdfbase64: pdfBytes }
}
