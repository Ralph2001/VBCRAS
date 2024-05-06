const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')

export async function generate_form(formData) {
    const create_form = await createFormByType(formData)
    return { success: true, filepath: folderPath }
}

let folderPath

const FORM1A_PATH = path.resolve(
    __dirname,
    '../../resources/documents/Forms/Form 1/Form1A.docx'
)
const FORM1B_PATH = path.resolve(
    __dirname,
    '../../resources/documents/Forms/Form 1/Form1B.docx'
)
const FORM1C_PATH = path.resolve(
    __dirname,
    '../../resources/documents/Forms/Form 1/Form1C.docx'
)

async function createFormByType(data) {
    console.log(data)
    if (data.type === 'Form 1A') {
        createForm1A(data)
    } else if (data.type === 'Form 1B') {
        createForm1B(data)
    } else if (data.type === 'Form 1C') {
        createForm1C(data)
    }
}

async function createForm1A(data) {
    // First Create Folder
    const create_folder = await folderCreation(data)

    // After Success Create Document
    if (create_folder) {
        // Form 1A Template Path
        const content = fs.readFileSync(FORM1A_PATH, 'binary')

        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        })

        doc.render({
            book: data.book_number,
            page: data.page_number,
            registry_number: data.registry_number,
            date_registration: data.date_registration,
            name_child: data.name_child,
            sex: data.sex,
            date_of_birth: data.date_of_birth,
            place_of_birth: data.place_of_birth,
            name_mother: data.name_mother,
            citizenship_mother: data.citizenship_mother,
            name_father: data.name_father,
            citizenship_father: data.citizenship_father,
            date_marriage: data.date_marriage,
            place_marriage: data.place_marriage,
            issued_to: data.issued_to,
            amount: data.amount,
            or_number: data.or_number,
            date_paid: data.date_paid,

            date_filed: data.date_filed,
            verified_by: data.verified_by,
            position: data.position,
            mcr: data.mcr,
        })

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        })

        // Create File in the folder
        fs.writeFileSync(`${folderPath + '/' + data.name_child}.docx`, buf)

        return true
    }
}

async function createForm1B(data) {
    // First Create Folder
    const create_folder = await folderCreation(data)

    // After Success Create Document
    if (create_folder) {
        // Form Template Path
        const content = fs.readFileSync(FORM1B_PATH, 'binary')

        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        })

        doc.render({
            document_owner: data.document_owner,
            mother: data.name_mother,
            father: data.name_father,
            date_of_birth: data.date_of_birth,
            year_recorded: data.year_recorded,

            issued_to: data.issued_to,
            amount: data.amount,
            or_number: data.or_number,
            date_paid: data.date_paid,

            date_filed: data.date_filed,
            verified_by: data.verified_by,
            position: data.position,
            mcr: data.mcr,
        })

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        })

        // Create File in the folder
        fs.writeFileSync(`${folderPath + '/' + data.document_owner}.docx`, buf)

        return true
    }
}

async function createForm1C(data) {
    // First Create Folder
    const create_folder = await folderCreation(data)

    // After Success Create Document
    if (create_folder) {
        // Form Template Path
        const content = fs.readFileSync(FORM1C_PATH, 'binary')

        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        })

        doc.render({
            year: data.year,
            period: data.period,
            destroyed_by: data.destroyed_by,

            document_owner: data.document_owner,
            mother: data.name_mother,
            father: data.name_father,
            date_of_birth: data.date_of_birth,
            year_recorded: data.year_recorded,

            issued_to: data.issued_to,
            amount: data.amount,
            or_number: data.or_number,
            date_paid: data.date_paid,

            date_filed: data.date_filed,
            verified_by: data.verified_by,
            position: data.position,
            mcr: data.mcr,
        })

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        })

        // Create File in the folder
        fs.writeFileSync(`${folderPath + '/' + data.document_owner}.docx`, buf)

        return true
    }
}

async function folderCreation(data) {
    const date_now = new Date()
    const doctype = data.type

    var folderCreation = `C:/VBCRAS/${date_now.getFullYear() + '/' + doctype}`

    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }

    folderPath = `C:/VBCRAS/${date_now.getFullYear() + '/' + doctype}/`

    return true
}
