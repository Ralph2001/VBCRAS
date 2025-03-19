/**
 * 
 * @description
 * Grabe hirap naman nito
 * 
 */





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
    const timesRomanFontBold = await pdfDoc.embedFont(
        StandardFonts.TimesRomanBold
    )

    pdfDoc.setTitle('Form 102 with Annotation for - ', {
        showInWindowTitleBar: true
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

    // Changeable
    const annotation_x = Number(formData.annotation_x)
    const annotation_y = Number(formData.annotation_y)
    // Const
    const annotation_rotation = Number(formData.annotation_rotation)
    const annotation_width = Number(formData.annotation_width)
    const annotation_font_size = Number(formData.annotation_font_size)
    const useAnnotationDocument = embeddedPage.scale(scale)

    // Page Size to 8.5 x 13
    const page = pdfDoc.addPage([612, 936])

    page.drawPage(embeddedPage, {
        ...useAnnotationDocument,
        x: page.getWidth() / 2 - useAnnotationDocument.width / x_position,
        y: page.getHeight() - useAnnotationDocument.height - y_position
    })

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    /**
     *  @description
     *  Split The HTML Text
     *  Create an Array with its width and if its bold
     *
     */

    const split = formData.annotation.split(' ')
    const filtered = []

    let currentArray = []
    let isBold = false
    let totalWidthSoFar = 0

    for (let index = 0; index < split.length; index++) {
        const text = split[index]
            .replace(/<[^>]*>/g, '')
            .replace('"', '“')
            .replace('"', '”')

        const fontType = isBold ? timesRomanFontBold : timesRomanFont
        const textWidth = fontType.widthOfTextAtSize(text, 12) + 3

        //if Total Width Reaches Max Limit, it will save the current array
      
        if (totalWidthSoFar + textWidth >= annotation_width) {
            filtered.push(currentArray)

            currentArray = []
            totalWidthSoFar = 0
        }

        if (
            split[index].startsWith('<strong>') &&
            split[index].endsWith('</strong>')
        ) {
            const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: true, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = false
            continue
        } else if (split[index].endsWith('<strong>')) {
            const whatwidth = timesRomanFont.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: false, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = true
            continue
        } else if (split[index].startsWith('<strong>')) {
            const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: true, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = true
            continue
        } else if (split[index].endsWith('</strong>')) {
            const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: true, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = false
            continue
        } else if (split[index].startsWith('</strong>')) {
            const whatwidth = timesRomanFont.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: false, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = false
            continue
        } else if (split[index].startsWith('<p><strong>')) {
            const whatwidth = timesRomanFontBold.widthOfTextAtSize(text, 12) + 3
            currentArray.push({ text, isBold: true, size: whatwidth })
            totalWidthSoFar += whatwidth
            isBold = true
            continue
        }

        currentArray.push({ text, isBold: isBold, size: textWidth })
        totalWidthSoFar += textWidth
    }

    /**
     *  If Current Array still holding value, push it to main filtered Array
     */

    if (currentArray.length > 0) {
        filtered.push(currentArray)
    }

    /**
     * Sa Totoo lang hindi ko nadin alam kung paano ko to nagawa hahaha baka chatgpt
     * basta magaadd ng blanks for example sa first array ay 810 total width niya mag-
     * dadagdag siya ng blanks/width para sa sakto sa limit na fe. 900
     */
    function addBlanks(data) {
    

        // Create a new array to store the modified lines without modifying the original data
        let newData = []

        for (let line of data) {
            let totalWidth = line.reduce((acc, item) => acc + item.size, 0)

            // Check if totalWidth is less than (annotation_width - 100)
            if (totalWidth < (annotation_width - 100)) {
                // Push the original line to the new array without modifications
                newData.push([...line])
                continue // Skip adding blanks if totalWidth is less than 700
            }

            // Check if totalWidth is less than annotation_width
            if (totalWidth < annotation_width) {
                // Create a new line with added blanks
                let newLine = [...line]
                const remainingSpace = annotation_width - totalWidth
                const blankItem = { text: ' ', isBold: false, size: 1 }

                // Calculate how many blank items are needed
                const numberOfBlanks = Math.ceil(remainingSpace)

                // Add blank items to the new line
                for (let i = 0; i < numberOfBlanks; i++) {
                    newLine.push(blankItem)
                }

                // Push the modified line to the new array
                newData.push(newLine)
            } else {
                // Push the original line to the new array without modifications
                newData.push([...line])
            }
        }

        // Return the new array with or without blanks added
        return newData
    }

    /**
     *  Distribute the Blanks to Make the Text Justify
     */

    function distributeBlanks(data) {
        return data.map((array) => {
            // Extract non-blank and blank items
            const nonBlanks = array.filter((item) => item.text.trim() !== '')
            const blanks = array.filter((item) => item.text.trim() === '')

            // Calculate the number of non-blank items
            const totalNonBlanks = nonBlanks.length

            // Calculate the number of blanks to distribute between each pair of non-blank items
            const blanksPerGap = Math.floor(
                blanks.length / (totalNonBlanks - 1)
            )
            const extraBlanks = blanks.length % (totalNonBlanks - 1)

            // Distribute blanks
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

    /**
     *  Function that will added blanks and distrute the blanks
     */

    const add_blanks = addBlanks(filtered)
    const sortedData = distributeBlanks(add_blanks)

    /**
     *  Main Function that Draw the Text
     *
     * TODO:
     *
     * Adding New Line
     * Landscape Mode
     *
     */

    let splitedwidth = 0
    let new_line = 0

    for (const line of sortedData) {
        for (const item of line) {
            // Annotation is Vertical
            if (annotation_rotation === Number(-90)) {
                firstPage.drawText(item.text, {
                    x: annotation_x - new_line,
                    y: height / 2 + annotation_y - splitedwidth,
                    size: annotation_font_size,
                    font: item.isBold ? timesRomanFontBold : timesRomanFont,
                    rotate: degrees(annotation_rotation),
                    lineHeight: 14
                })

            }
            // Annotation is Horizontal
            else if (annotation_rotation === Number(0)) {
                firstPage.drawText(item.text, {
                    x: annotation_x + splitedwidth,
                    y: annotation_y - new_line,
                    size: annotation_font_size,
                    font: item.isBold ? timesRomanFontBold : timesRomanFont,
                    rotate: degrees(annotation_rotation),
                    lineHeight: 14
                })
            }
            splitedwidth += item.size
    

        }
        new_line += 14
        splitedwidth = 0
    }
    
    pdfBytes = await pdfDoc.saveAsBase64()

    return { status: true, pdfbase64: pdfBytes }
}
