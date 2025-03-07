
const path = require('path')

// FILE PATHS HERE
// DOCX FORMAT ONLY
// NAME OF TEMPLATE COULD BE BETTER


export const PETITION_TEMPLATE_PATHS = {
    LIVEBIRTH: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Live Birth/petition.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    DEATH: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Death/petition.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    MARRIAGE: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Marriage/petition.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    CFN: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Change First Name/petition.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    CCE10172: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Live Birth/petition_RA_10172.docx'
        )
        .replace('app.asar', 'app.asar.unpacked')
}

export const ADDITIONAL_FILES_TEMPLATE = {
    ENDORSEMENT_LETTER: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/endorsement.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    RECORD_SHEET: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/record sheet.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    POSTING: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/notice and certificate.docx'
        )
        .replace('app.asar', 'app.asar.unpacked')
}


// FUNCTION THAT CHECKS THE FILES
// COULD BE BETTER, IDK
export function checkFilesExist(paths) {
    for (const filePath of paths) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }
    }
    // RETURN TRUE IF FILES EXISTED
    return true
}

// FUNCTION THAT SAVE THE DOCUMENT
// NEEDED FOR ALL FUNCTION
function saveDocument(doc, fileName, folderPath) {
    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    })
    fs.writeFileSync(path.join(folderPath, fileName), buf)
}



/**
 * For Temporary files
 */
function generateRandomString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    // Get the current time in milliseconds
    const currentTime = Date.now().toString()
    // Generate a random letter
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    // Generate a random number (optional, for extra randomness)
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
    // Combine the current time with a random letter and number
    const randomString = randomLetter + randomNumber + currentTime
    return randomString
}

// FIRST CREATE DOCUMENT FOLDER BEFORE
// GENERATING NEW DOCUMENTS
// MAKE ADJUSTMENTS IN FILE DIRECTORY
async function document_folder(data) {
    const petition_type = data.petition_type
    const republic_act = data.republic_act_number
    const who_owns_it =
        data.document_owner === 'N/A'
            ? data.petitioner_name
            : data.document_owner
    var folderCreation = path
        .join(
            __dirname,
            `..\\..\\resources\\temp\\Generated\\${generateRandomString()}\\${petition_type} ${republic_act}\\${who_owns_it}\\`
        )
        .replace('app.asar', 'app.asar.unpacked')
    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }
    main_folder_path = folderCreation
    console.log(main_folder_path)
    return true
}

// FUNCTION THAT READ THE PETITION FILE BASED ON SELECTED
// PETITION TYPE, EVENT TYPE AND REPUBLIC ACT NUMBER
// AND RETURN AS BINARY
async function PetitionFile(republic_act_number, petition_type, event_type) {
    const pathMap = {
        '9048-CCE-Birth': PETITION_TEMPLATE_PATHS.LIVEBIRTH,
        '9048-CCE-Marriage': PETITION_TEMPLATE_PATHS.MARRIAGE,
        '9048-CCE-Death': PETITION_TEMPLATE_PATHS.DEATH,
        '9048-CFN-Birth': PETITION_TEMPLATE_PATHS.CFN,
        '10172-CCE-Birth': PETITION_TEMPLATE_PATHS.CCE10172
    }

    const key = `${republic_act_number}-${petition_type}-${event_type}`
    const filePath = pathMap[key]

    return filePath ? fs.readFileSync(filePath, 'binary') : ''
}