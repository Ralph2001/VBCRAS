const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')


const PATHS = {
    FINALITY_PATH:  path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Finality/finality.docx').replace('app.asar', 'app.asar.unpacked'),
    ENDORSEMENT_LETTER_PATH: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Finality/endorsement.docx').replace('app.asar', 'app.asar.unpacked')
}

let main_folder_path



export async function finality(formData) {
  
    const folderCreation = await document_folder(formData)
    const finalityCreation = await create_finality(formData)
    const endorsementCreation = await create_endorsement(formData)

    return { success: true, filepath: main_folder_path }
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

    return true
}


 async function create_finality(data) {
    const content =  fs.readFileSync(PATHS.FINALITY_PATH, 'binary')


    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let petition_type = ''
    if (data.petition_type === 'CCE') {
        petition_type = 'Correction of Clerical Error'
    } else if (data.petition_type === 'CFN') {
        petition_type = 'Change of First Name'
    }

    let document_type = ''
    if (data.event_type === 'Birth') {
        document_type = 'Certificate of Live Birth'
    } else if (data.event_type === 'Death') {
        document_type = 'Certificate of Death'
    } else if (data.event_type === 'Marriage') {
        document_type = 'Certificate of Marriage'
    }

    let document_owner = ''
    if (data.document_owner === 'N/A' || data.document_owner === '') {
        document_owner = data.petitioner_name
    } else {
        document_owner = data.document_owner
    }

    const date_granted = dateFns.format(
        data.petition_date_granted,
        'dd MMMM yyyy'
    )
    const day = dateFns.format(data.petition_date_granted, 'do')
    const monthyear = dateFns.format(data.petition_date_granted, 'MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        petition_type: petition_type,
        document_type: document_type,
        event_type: data.event_type,
        document_owner: document_owner,
        date_granted: date_granted,
        municipal_civil_registrar: data.municipal_civil_registrar,
        day: day,
        month_year: monthyear,
    })

    saveDocument(doc, 'Certificate of Finality.docx', main_folder_path)
    return true
}

async function create_endorsement(data) {
    const content =  fs.readFileSync(PATHS.ENDORSEMENT_LETTER_PATH, 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let petition_type = ''
    if (data.petition_type === 'CCE') {
        petition_type = 'Correction of Clerical Error'
    } else if (data.petition_type === 'CFN') {
        petition_type = 'Change of First Name'
    }

    let document_type = ''
    if (data.event_type === 'Birth') {
        document_type = 'Certificate of Live Birth'
    } else if (data.event_type === 'Death') {
        document_type = 'Certificate of Death'
    } else if (data.event_type === 'Marriage') {
        document_type = 'Certificate of Marriage'
    }

    let document_owner = ''
    if (data.document_owner === 'N/A' || data.document_owner === '') {
        document_owner = data.petitioner_name
    } else {
        document_owner = data.document_owner
    }

    let event_type = ''
    if (data.event_type === 'Birth') {
        event_type = 'born on'
    } else if (data.event_type === 'Death') {
        event_type = 'died on'
    } else if (data.event_type === 'Marriage') {
        event_type = 'married on'
    }


    const event_date = dateFns.format(data.event_date, 'dd MMMM yyyy')
    const date_granted = dateFns.format(
        data.petition_date_granted,
        'dd MMMM yyyy'
    )
    const day = dateFns.format(data.petition_date_granted, 'do')
    const monthyear = dateFns.format(data.petition_date_granted, 'MMMM yyyy')

    doc.render({

        subject_code: data.republic_act_number,

        event_type: event_type,
        event_date: event_date,

        registry_number: data.registry_number,
        petition_type: petition_type,
        document_type: document_type,
        document_owner: document_owner,
        date_granted: date_granted,
        municipal_civil_registrar: data.municipal_civil_registrar,
        day: day,
        month_year: monthyear,
    })

    saveDocument(doc, 'Finality Endorsement Letter.docx', main_folder_path)
    return true
}
