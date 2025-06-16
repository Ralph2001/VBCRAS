const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')
const os = require('os')

const PATHS = {
    CERTIFICATE_FILING: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/certificate of filing.docx'
        )
        .replace('app.asar', 'app.asar.unpacked')
}
let main_folder_path

export async function certificate_filing(formData) {
    try {
        await create_certificate_filing(formData)
    } catch (error) {
        console.log(error)
    }

    return { success: true, filepath: main_folder_path }
}

// FUNCTION THAT SAVE THE DOCUMENT
// NEEDED FOR ALL FUNCTION
function saveDocument(doc, fileName, folderPath) {
    const userBasePath = os.homedir()

    // Ensure folderPath is absolute, resolve from userBasePath if not
    const finalFolderPath = path.isAbsolute(folderPath)
        ? folderPath
        : path.join(userBasePath, folderPath)

    // Ensure directory exists
    fs.mkdirSync(finalFolderPath, { recursive: true })

    main_folder_path = path.join(folderPath, 'Certificate of Filing.docx')
    const fullPath = path.join(finalFolderPath, fileName)

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    })

    fs.writeFileSync(fullPath, buf)
}

async function create_certificate_filing(data) {
    const content = fs.readFileSync(PATHS.CERTIFICATE_FILING, 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
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

    const date = dateFns.format(new Date(), 'MMMM dd, yyyy')
    const date_filed = dateFns.format(data.date_filed, 'MMMM dd, yyyy')

    let relation = ''
    if (data.petitioner_error_in === 'my') {
        relation = ''
    } else if (data.petitioner_error_in === 'the') {
        relation = data.relation_owner.toLowerCase() + '`s'
    }

    const first_name_from = data.first_name_from
    const first_name_to = data.first_name_to

    let clerical_errors
    if (data.petition_type === 'CCE') {
        clerical_errors = data.clerical_errors
    } else if (data.petition_type === 'CFN') {
        const main_value = [
            {
                description: 'Change of First Name',
                error_description_from: first_name_from,
                error_description_to: first_name_to
            }
        ]

        clerical_errors = main_value
    }

    function capitalizeFirstLetter(value) {
        const str = value.toLowerCase()
        return str.replace(/\b\w/g, (char) => char.toUpperCase())
    }

    doc.render({
        date: date,
        petitioner_name: capitalizeFirstLetter(data.petitioner_name),
        petition_type: petition_type,
        relation: relation,

        clerical: clerical_errors,

        event_type: document_type,
        document_owner: capitalizeFirstLetter(document_owner),
        petition_number: data.petition_number,
        date_filed: date_filed,
        subject_code: data.republic_act_number,
        registry_number: data.registry_number,
        municipal_civil_registrar: data.municipal_civil_registrar
    })

    saveDocument(doc, 'Certificate of Filing.docx', data.file_path)
    return true
}
