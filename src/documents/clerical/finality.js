const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')

export async function finality(formData) {
    const folderCreation = await document_folder(formData)
    const finalityCreation = await create_finality(formData)

    return { success: true, filepath: folderPath }
}

const FINALITY_PATH = path.resolve(
    __dirname,
    '../../resources/documents/RA 9048 RA 10172/Finality/finality.docx'
)

let folderPath

function finalityPath(status) {
    // let content = ''
    return fs.readFileSync(FINALITY_PATH, 'binary')
}

async function document_folder(data) {
   
    var folderCreation = data.filepath + '/Finality'
    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }
    folderPath = data.filepath + '/Finality'
    return true
}

async function create_finality(data) {
    const content = finalityPath(data)
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let petition_type = ''
    if (data.type === 'CCE') {
        petition_type = 'Correction of Clerical Error'
    } else if (data.type === 'CFN') {
        petition_type = 'Change of First Name'
    }

    let document_type = ''
    if (data.document_type === 'Birth') {
        document_type = 'Certificate of Live Birth'
    } else if (data.document_type === 'Death') {
        document_type = 'Certificate of Death'
    } else if (data.document_type === 'Marriage') {
        document_type = 'Certificate of Marriage'
    }

    let name_owner = ''
    if (data.name_owner === 'N/A' || data.name_owner === '') {
        name_owner = data.petitioner_name
    } else {
        name_owner = data.name_owner
    }

    const date_granted = dateFns.format(
        data.certificate_posting_start,
        'dd MMMM yyyy'
    )
    const day = dateFns.format(data.date_granted, 'do')
    const monthyear = dateFns.format(data.date_granted, 'MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        type: petition_type,
        document_type: document_type,
        name_owner: name_owner,
        date_granted: date_granted,
        mcr: data.mcr,
        day: day,
        monthyear: monthyear,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(`${folderPath + '/'}Certificate of Finality.docx`, buf)
    return true
}
