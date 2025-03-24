import { PDFDocument, StandardFonts } from "pdf-lib";

export async function dumb_maker(data) {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();

    const fonts = {
        regular: await pdfDoc.embedFont(StandardFonts.TimesRoman),
        bold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
        boldItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic),
        italic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
    };

    let currentY = page.getHeight() - 72;
    const lineHeight = 14;
    const maxWidth = 595 - 144; // A4 width minus margins

    const words = [];
    for (const main_value of data.ops) {
        const attributes = main_value.attributes || {};
        const fontType = attributes.bold && attributes.italic ? fonts.boldItalic :
            attributes.bold ? fonts.bold :
                attributes.italic ? fonts.italic :
                    fonts.regular;

        const insertText = main_value.insert || '';
        // Split text into paragraphs using newline characters
        const lines = insertText.split('\n');
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            // Split paragraph into words
            const splitWords = line.split(/\s+/).filter(word => word.length > 0);
            for (const wordText of splitWords) {
                words.push({ text: wordText, font: fontType });
            }
            // Add a forced newline marker after each line except the last one
            if (lineIdx < lines.length - 1) {
                words.push({ isNewLine: true });
            }
        }
    }

    let currentLine = [];
    let currentLineWidth = 0;

    for (const word of words) {
        if (word.isNewLine) {
            // Force a new line for Enter key
            if (currentLine.length > 0) {
                drawLine(currentLine, 72, currentY, maxWidth, page, true);
                currentY -= lineHeight;
                if (currentY < 72) {
                    page = pdfDoc.addPage();
                    currentY = page.getHeight() - 72;
                }
            }
            currentLine = [];
            currentLineWidth = 0;
            continue;
        }

        const wordWidth = word.font.widthOfTextAtSize(word.text, 12);
        let tentativeWidth = currentLineWidth + (currentLine.length > 0 ? word.font.widthOfTextAtSize(' ', 12) : 0) + wordWidth;

        if (tentativeWidth > maxWidth) {
            drawLine(currentLine, 72, currentY, maxWidth, page, false);
            currentY -= lineHeight;
            if (currentY < 72) {
                page = pdfDoc.addPage();
                currentY = page.getHeight() - 72;
            }
            currentLine = [word];
            currentLineWidth = wordWidth;
        } else {
            if (currentLine.length > 0) {
                currentLineWidth += word.font.widthOfTextAtSize(' ', 12);
            }
            currentLine.push(word);
            currentLineWidth += wordWidth;
        }
    }

    if (currentLine.length > 0) {
        drawLine(currentLine, 72, currentY, maxWidth, page, true);
    }

    const pdfBytes = await pdfDoc.saveAsBase64();
    return pdfBytes;
}

function drawLine(lineWords, xStart, y, maxWidth, page, isLastLine) {
    if (lineWords.length === 0) return;

    let totalWordsWidth = 0;
    let totalSpacesWidth = 0;
    const numberOfGaps = lineWords.length - 1;

    for (let i = 0; i < lineWords.length; i++) {
        const word = lineWords[i];
        totalWordsWidth += word.font.widthOfTextAtSize(word.text, 12);
        if (i < numberOfGaps) {
            const spaceWidth = word.font.widthOfTextAtSize(' ', 12);
            totalSpacesWidth += spaceWidth;
        }
    }

    const totalWidth = totalWordsWidth + totalSpacesWidth;
    let extraSpacePerGap = 0;

    if (!isLastLine && numberOfGaps > 0) {
        extraSpacePerGap = (maxWidth - totalWidth) / numberOfGaps;
    }

    let currentX = xStart;

    for (let i = 0; i < lineWords.length; i++) {
        const word = lineWords[i];
        if (i === 0) {
            page.drawText(word.text, { x: currentX, y, font: word.font, size: 12 });
            currentX += word.font.widthOfTextAtSize(word.text, 12);
        } else {
            const spaceWidth = lineWords[i - 1].font.widthOfTextAtSize(' ', 12) + extraSpacePerGap;
            currentX += spaceWidth;
            page.drawText(word.text, { x: currentX, y, font: word.font, size: 12 });
            currentX += word.font.widthOfTextAtSize(word.text, 12);
        }
    }
}