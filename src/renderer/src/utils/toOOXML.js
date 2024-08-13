function toOOXML(data) {
    const words = data.split(' ')
    let textFormatted = ''
    let inQuotes = false

    words.forEach((word) => {
        if (word.startsWith('"')) {
            inQuotes = true
        }

        const formattedWord = `
        <w:r>
            <w:rPr>
            ${inQuotes ? '<w:b/>' : ''}
                <w:rFonts w:ascii="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>
                ${word.replace(`"`, '“').replace(`"`, '”')}&#160;
                </w:t>
        </w:r>

      ` // Notice the change within <w:t>

        textFormatted += formattedWord

        if (word.endsWith('"') || word.endsWith('";') || word.endsWith('".')) {
            inQuotes = false
        }
    })

    return textFormatted
}

// function format() {
//     const fromTextAndtoText = computed(() => {
//         const fromText = `“${formData.clerical_errors.from}”&#160;`
//         const toText = `“${formData.clerical_errors.to}”`

//         let text = `
//               <w:r>
//                   <w:rPr>
//                   <w:rFonts w:ascii="Arial"/>
//                   <w:sz w:val="22"/>
//                   <w:b/>
//                   </w:rPr>
//                   <w:t>${fromText}</w:t>
//               </w:r>

//               <w:r>
//                   <w:rPr>
//                   <w:rFonts w:ascii="Arial"/>
//                   <w:sz w:val="22"/>
//                   </w:rPr>
//                       <w:t> to&#160;</w:t>
//               </w:r>

//               <w:r>
//                   <w:rPr>
//                   <w:rFonts w:ascii="Arial"/>
//                   <w:b/>
//                   <w:sz w:val="22"/>
//                   </w:rPr>
//                       <w:t>${toText}&#160;</w:t>
//               </w:r>`

//         return text
//     })

//     const formatted = computed(() => {
//         const words = formData.decision.split(' ')
//         let textFormatted = ''

//         words.forEach((word) => {
//             const formattedWord = `
//                   <w:r><w:rPr><w:rFonts w:ascii="Arial"/><w:sz w:val="22"/></w:rPr><w:t>${word}&#160;</w:t></w:r>
//              `

//             textFormatted += formattedWord
//         })

//         return textFormatted
//     })

//     const ooxml = computed(() => {
//         let ooxml = formatted.value.replace(
//             `<w:r><w:rPr><w:rFonts w:ascii="Arial"/><w:sz w:val="22"/></w:rPr><w:t>@here&#160;</w:t></w:r>`,
//             fromTextAndtoText.value
//         )
//         return ooxml
//     })
// }

export default toOOXML
