function escapeXml(unsafe) {
    return unsafe.replace(/[<>&"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
        }
    });
}

export function toOOXML(data) {
    if (typeof data !== 'string') {
        throw new Error('Invalid input: data must be a string.');
    }

    const normalizedData = data
        .replace(/[\u200B\u00A0]/g, '')   // Remove zero-width/nbsp
        .replace(/-\n/g, '')             // Handle hyphenated line breaks
        .replace(/\n/g, ' ')             // Normalize line breaks
        .replace(/\s+/g, ' ')            // Collapse multiple spaces
        .trim();

    const parts = [];
    let inQuotes = false;
    let currentPhrase = [];

    for (const word of normalizedData.split(' ')) {
        const startsWithQuote = word.startsWith('"');
        const endsWithQuote = word.endsWith('"') || word.endsWith('";') || word.endsWith('".');

        if (startsWithQuote || inQuotes) {
            currentPhrase.push(word);
            if (endsWithQuote) {
                parts.push({ text: currentPhrase.join(' '), bold: true });
                currentPhrase = [];
                inQuotes = false;
            } else {
                inQuotes = true;
            }
        } else {
            parts.push({ text: word, bold: false });
        }
    }

    if (currentPhrase.length > 0) {
        parts.push({ text: currentPhrase.join(' '), bold: true });
    }

    // Build OOXML runs
    const runs = parts.map(({ text, bold }) => {
        const escaped = escapeXml(text + ' '); // add space inside the <w:t>
        return `
<w:r>
    <w:rPr>
        ${bold ? '<w:b/>' : ''}
        <w:rFonts w:ascii="Arial"/>
        <w:sz w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">${escaped}</w:t>
</w:r>`;
    }).join('');

    // Final wrapped paragraph
    return `
<w:p>
    <w:pPr>
        <w:jc w:val="both"/>
        <w:suppressAutoHyphens w:val="1"/>
        <w:hyphenationZone w:val="0"/>
    </w:pPr>
    ${runs}
</w:p>`;
}

export default toOOXML;
