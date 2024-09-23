const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')


const PATHS = {
    CERTIFICATE_FILING: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/certificate of filing.docx').replace('app.asar', 'app.asar.unpacked'),
}
let main_folder_path


export async function certificate_filing(formData) {

    await create_certificate_filing(formData)

    return { success: true, filepath: main_folder_path }
}


// FUNCTION THAT SAVE THE DOCUMENT
// NEEDED FOR ALL FUNCTION
function saveDocument(doc, fileName, folderPath) {
    main_folder_path = path.join(folderPath, fileName)
    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    })
    fs.writeFileSync(path.join(folderPath, fileName), buf)
}


async function create_certificate_filing(data) {
    const content = fs.readFileSync(PATHS.CERTIFICATE_FILING, 'binary')


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

    const date = dateFns.format(
        new Date(),
        'MMMM dd, yyyy'
    )
    const date_filed = dateFns.format(
        data.date_filed,
        'MMMM dd, yyyy'
    )

    let relation = ''
    if (data.petitioner_error_in === 'my') {
        relation = ''
    }
    else if (data.petitioner_error_in === 'the') {
        relation = data.relation_owner.toLowerCase() + '`s'
    }


    doc.render({
        date: date,
        petitioner_name: data.petitioner_name,
        petition_type: petition_type,
        relation: relation,

        clerical: data.clerical_errors,
        
        event_type: document_type,
        document_owner: document_owner,
        petition_number: data.petition_number,
        date_filed: date_filed,
        subject_code: data.republic_act_number,
        registry_number: data.registry_number,
        petitioner_name: data.petitioner_name,
        municipal_civil_registrar: data.municipal_civil_registrar
    })

    saveDocument(doc, 'Certificate of Filing.docx', data.file_path)
    return true
}

