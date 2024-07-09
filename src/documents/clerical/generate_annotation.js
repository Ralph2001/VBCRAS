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
  //     maxWidth: 900,
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
  let y_value = 450

  const split = formData.annotation.split(' ');
  const filtered = [];
  let currentArray = [];
  let isBold = false
  let totalWidthSoFar = 0;
  const blankSpaceWidth = 1;

  // Good
  for (let index = 0; index < split.length; index++) {


    const text = split[index]
      .replace(/<[^>]*>/g, '')
      .replace('"', '“')
      .replace('"', '”')


    const fontType = isBold ? timesRomanFontBold : timesRomanFont
    const textWidth = fontType.widthOfTextAtSize(text, 12) + 3;

    //if Total Width Reaches Max Limit, it will save the current array 
    if (totalWidthSoFar + textWidth >= 900) {
      filtered.push(currentArray);

      currentArray = [];
      totalWidthSoFar = 0;
    }


    if (split[index].startsWith('<strong>') && split[index].endsWith('</strong>')) {
      const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3;
      currentArray.push({ text, isBold: true, size: whatwidth });
      totalWidthSoFar += whatwidth;
      isBold = false
      continue
    }

    else if (split[index].endsWith('<strong>')) {
      const whatwidth = timesRomanFont.widthOfTextAtSize(text, 12) + 3;
      currentArray.push({ text, isBold: false, size: whatwidth });
      totalWidthSoFar += whatwidth;
      isBold = true
      continue
    }

    else if (split[index].startsWith('<strong>')) {
      const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3;
      currentArray.push({ text, isBold: true, size: whatwidth });
      totalWidthSoFar += whatwidth;
      isBold = true
      continue
    }

    else if (split[index].endsWith('</strong>')) {
      const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3;
      currentArray.push({ text, isBold: true, size: whatwidth });
      totalWidthSoFar += whatwidth;
      isBold = false
      continue
    }

    else if (split[index].startsWith('</strong>')) {
      const whatwidth = timesRomanFont.widthOfTextAtSize(text, 12) + 3;
      currentArray.push({ text, isBold: false, size: whatwidth });
      totalWidthSoFar += whatwidth;
      isBold = false
      continue
    }


    currentArray.push({ text, isBold: isBold, size: textWidth });
    totalWidthSoFar += textWidth;
  }

  if (currentArray.length > 0) {
    filtered.push(currentArray);
  }





  function addBlanks(data) {
    const targetWidth = 900;
    const minimumWidthToAddBlanks = 800;

    // Create a new array to store the modified lines without modifying the original data
    let newData = [];

    for (let line of data) {
      let totalWidth = line.reduce((acc, item) => acc + item.size, 0);

      // Check if totalWidth is less than minimumWidthToAddBlanks
      if (totalWidth < minimumWidthToAddBlanks) {
        // Push the original line to the new array without modifications
        newData.push([...line]);
        continue; // Skip adding blanks if totalWidth is less than 700
      }

      // Check if totalWidth is less than targetWidth
      if (totalWidth < targetWidth) {
        // Create a new line with added blanks
        let newLine = [...line];
        const remainingSpace = targetWidth - totalWidth;
        const blankItem = { text: ' ', isBold: false, size: 1 };

        // Calculate how many blank items are needed
        const numberOfBlanks = Math.ceil(remainingSpace);

        // Add blank items to the new line
        for (let i = 0; i < numberOfBlanks; i++) {
          newLine.push(blankItem);
        }

        // Push the modified line to the new array
        newData.push(newLine);
      } else {
        // Push the original line to the new array without modifications
        newData.push([...line]);
      }
    }

    // Return the new array with or without blanks added
    return newData;
  }


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

  const add_blanks = addBlanks(filtered)
  const sortedData = distributeBlanks(add_blanks)

  // console.log(sortedData)

  // for (const line of sortedData) {
  //   let totalwidth = 0
  //   for (const item of line) {
  //     totalwidth += item.size
  //   }
  //   console.log(`Total width of: ${totalwidth}`)
  //   totalwidth = 0
  // }
  // console.log(sortedData)
  // Loop through filtered array and calculate total sizes
  // for (const line of sortedData) {

  //   for (const item of line) {
  //     firstPage.drawText(item.text, {
  //       x: x_value,
  //       y: height / 2 + annotation_y - splitedwidth,
  //       size: 12,
  //       font: item.isBold ? timesRomanFontBold : timesRomanFont,
  //       rotate: degrees(annotation_angle),
  //       lineHeight: 14
  //     })
  //     // if (item.size === 1) {
  //     //   splitedwidth += item.size
  //     //   continue
  //     // }
  //     splitedwidth += item.size
  //   }
  //   x_value += -14
  //   splitedwidth = 0

  // }



  for (const line of sortedData) {

    for (const item of line) {
      firstPage.drawText(item.text, {
        x: x_value,
        y: height / 2 + annotation_y - splitedwidth,
        size: 12,
        font: item.isBold ? timesRomanFontBold : timesRomanFont,
        rotate: degrees(annotation_angle),
        lineHeight: 14
      })
      // if (item.size === 1) {
      //   splitedwidth += item.size
      //   continue
      // }
      splitedwidth += item.size
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
