const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')

export async function generate(formData) {
    const folderCreation = await document_folder(formData)
    const petitionCreation = await petition(formData)

    const endorsement_letterCreation = await endorsement_letter(formData)
    const record_sheetCreation = await record_sheet(formData)
    const notice_postingCreation = await notice_posting(formData)
    const certificate_postingCreation = await certificate_posting(formData)

    return { success: true }
}

let folderPath

async function document_folder(data) {
    const date_now = new Date()
    const doctype = data.type
    const petitioner_name = data.petitioner_name

    var folderCreation = path.resolve(
        __dirname,
        `../../output/${
            date_now.getFullYear() + ' ' + doctype + ' ' + petitioner_name
        }`
    )

    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }

    folderPath = `../../output/${
        date_now.getFullYear() + ' ' + doctype + ' ' + petitioner_name
    }/`

    return true
}

async function endorsement_letter(data) {
    const status = true

    if (status) {
        return true
    }
}
async function petition(data) {
    const date_now = new Date()
    const number =
        data.type + '-' + data.petition_number + '-' + date_now.getFullYear()
    const doctype = data.type

    const content = fs.readFileSync(
        path.resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Live Birth/petition.docx'
        ),
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const petitioner_name = data.petitioner_name
    const petitioner_number = number
    const petitioner_address =
        data.barangay + ', ' + data.city + ', ' + data.province

    const rawXML = `'` + data.decision + `'`

    doc.render({
        petition_number: petitioner_number,
        petitioner_name: petitioner_name,
        nationality: data.nationality,
        petitioner_address: petitioner_address,
        name_owner: data.name_owner,
        relation_owner: data.relation_owner,
        date_of_birth: data.date_of_birth,
        at_city: data.at_city,
        registry_number: data.registry_number,
        reason: data.reason,
        LCRO_city: data.LCRO_city,
        LCRO_province: data.LCRO_province,

        day_ss: '',
        monthyear_ss: '',
        place_ss: data.SwornCity,
        Ctc: data.Ctc,
        CtcIssuedAt: data.CtcIssuedAt,
        CtcIssuedOn: data.CtcIssuedOn,
        administering_officer: data.administering_officer,
        administering_position: data.administering_position,
        decision: rawXML,
        ActionDate: data.ActionDate,
        mcr: data.mcr,
        or_number: data.or_number,
        DatePaid: data.DatePaid,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(
        path.resolve(__dirname, `${folderPath + '/' + petitioner_name}.docx`),
        buf
    )

    return true
}

async function record_sheet(data) {
    const status = true

    if (status) {
        return true
    }
}

async function notice_posting(data) {
    const status = true

    if (status) {
        return true
    }
}

async function certificate_posting(data) {
    const status = true

    if (status) {
        return true
    }
}
