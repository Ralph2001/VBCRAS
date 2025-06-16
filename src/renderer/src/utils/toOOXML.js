function escapeXml(unsafe) {
    return unsafe.replace(/[<>&]/g, function (c) {
        switch (c) {
            case '<':
                return '&lt;'
            case '>':
                return '&gt;'
            case '&':
                return '&amp;'
        }
    })
}

export function toOOXML(data) {
    // Normalize input: remove unwanted line breaks, preserve content
    if (typeof data !== 'string') {
        throw new Error('Invalid input: data must be a string.')
    }

    const normalizedData = data
        .replace(/[\u200B\u00A0]/g, '') // remove invisible or NBSP chars
        .replace(/-\n/g, '') // handle hyphenated line breaks
        .replace(/\n/g, ' ') // normalize line breaks
        .replace(/\s+/g, ' ') // collapse multiple spaces
        .trim() // trim leading/trailing
    const parts = []
    let inQuotes = false
    let currentPhrase = []

    for (const word of normalizedData.split(' ')) {
        const startsWithQuote = word.startsWith('"')
        const endsWithQuote =
            word.endsWith('"') || word.endsWith('";') || word.endsWith('".')

        if (startsWithQuote || inQuotes) {
            currentPhrase.push(word)

            if (endsWithQuote) {
                parts.push({ text: currentPhrase.join(' '), bold: true })
                currentPhrase = []
                inQuotes = false
            } else {
                inQuotes = true
            }
        } else {
            parts.push({ text: word, bold: false })
        }
    }

    // If still in quotes at the end
    if (currentPhrase.length > 0) {
        parts.push({ text: currentPhrase.join(' '), bold: true })
    }

    const runs = parts
        .map(({ text, bold }) => {
            const escaped = escapeXml(text)
            return `
            <w:r>
                <w:rPr>
                    ${bold ? '<w:b/>' : ''}
                    <w:rFonts w:ascii="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
           <w:t xml:space="preserve">${escaped}</w:t>
            </w:r>`
        })
        .join('')

    // Return inside one paragraph block
    return `
<w:p>
    <w:pPr>
        <w:jc w:val="both"/> 
        <w:suppressAutoHyphens w:val="1"/> 
        <w:hyphenationZone w:val="0"/> 
    </w:pPr>
    ${runs}
</w:p>`
}

export default toOOXML
