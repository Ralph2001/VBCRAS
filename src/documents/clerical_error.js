const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')

export async function generate(formData) {
    const folderCreation = await document_folder(formData)
    const petitionCreation = await petition(formData)
    const endorsement_letterCreation = await endorsement_letter(formData)
    const record_sheetCreation = await record_sheet(formData)
    const notice_and_certificate_posting = await posting(formData)

    return { success: true, filepath: folderPath }
}

const LIVEBIRTH_PATH = path.resolve(
    __dirname,
    '../../resources/documents/RA 9048 RA 10172/Live Birth/petition.docx'
)
const DEATH_PATH = path.resolve(
    __dirname,
    '../../resources/documents/RA 9048 RA 10172/Death/petition.docx'
)
const MARRIAGE_PATH = path.resolve(
    __dirname,
    '../../resources/documents/RA 9048 RA 10172/Marriage/petition.docx'
)
const CFN_PATH = path.resolve(
    __dirname,
    '../../resources/documents/RA 9048 RA 10172/Change First Name/petition.docx'
)

let folderPath

async function PetitionFile(type, document_type) {
    let content = ''
    if ((type === 'CCE') & (document_type === 'Birth')) {
        content = fs.readFileSync(LIVEBIRTH_PATH, 'binary')
    } else if ((type === 'CCE') & (document_type === 'Marriage')) {
        content = fs.readFileSync(MARRIAGE_PATH, 'binary')
    } else if ((type === 'CCE') & (document_type === 'Death')) {
        content = fs.readFileSync(DEATH_PATH, 'binary')
    } else if ((type === 'CFN') & (document_type === 'Birth')) {
        content = fs.readFileSync(CFN_PATH, 'binary')
    }
    return content
}

async function document_folder(data) {
    const date_now = new Date()
    const doctype = data.type
    const petitioner_name = data.petitioner_name

    var folderCreation = `C:/VBCRAS/${
        date_now.getFullYear() + '/' + doctype + ' ' + petitioner_name
    }`

    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }

    folderPath = `C:/VBCRAS/${
        date_now.getFullYear() + '/' + doctype + ' ' + petitioner_name
    }/`

    return true
}

async function endorsement_letter(data) {
    const content = fs.readFileSync(
        path.resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/endorsement.docx'
        ),
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let document_owner = ''
    if ((data.name_owner = 'N/A')) {
        document_owner = data.petitioner_name
    } else {
        document_owner = data.name_owner
    }

    let type_of_document = ''
    if (data.document_type === 'Birth') {
        type_of_document = 'Certificate of Live Birth'
    } else if (data.document_type === 'Marriage') {
        type_of_document = 'Certificate of Marriage'
    } else if (data.document_type === 'Death') {
        type_of_document = 'Certificate of Death'
    }

    let type_of_petition = ''
    if (data.type === 'CCE') {
        type_of_petition = 'Correction of Clerical Error'
    } else if (data.type === 'CFN') {
        type_of_petition = 'Change of First Name'
    }

    const granted_date = dateFns.format(data.date_granted, 'dd MMMM yyyy')

    doc.render({
        date: granted_date,
        petition_type: type_of_petition,
        document_type: type_of_document,
        document_owner: document_owner,
        mcr: data.mcr,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(`${folderPath + '/'}Endorsement Letter.docx`, buf)

    return true
}
async function petition(data) {
    const content = await PetitionFile(data.type, data.document_type)

    const support = JSON.parse(data.supportingDocuments)
    const supporting_documents = {
        list: [...support].map((supportName) => ({
            name: supportName,
        })),
    }

    const clerical = JSON.parse(data.clerical_errors)
    const clerical_errors = {
        errors: clerical.description.map((description, index) => ({
            description,
            from: clerical.from[index],
            to: clerical.to[index],
        })),
    }

    const grounds_filing = JSON.parse(data.grounds)
    const grounds = {
        a: grounds_filing.a,
        b: grounds_filing.b,
        c: grounds_filing.c,
        d: grounds_filing.d,
        e: grounds_filing.e,
        f: grounds_filing.f,
    }

    let a = grounds_filing.a ? true : false
    let b = grounds_filing.b ? true : false
    let c = grounds_filing.c ? true : false
    let d = grounds_filing.d ? true : false
    let e = grounds_filing.e ? true : false
    let f = grounds_filing.f ? true : false

    console.log(a, b, c, d, e, f)

    const date_now = new Date()
    const number = data.petition_number
    const doctype = data.type

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const petitioner_name = data.petitioner_name
    const petitioner_number = number

    const petitioner_addressFormatted =
        data.petitioner_barangay +
        ', ' +
        data.petitioner_city +
        ', ' +
        data.petitioner_province

    const rawXML = `'` + data.decision + `'`

    const day_ss = dateFns.format(data.SwornDate, 'do')
    const monthyear_ss = dateFns.format(data.SwornDate, 'MMMM yyyy')

    let spouse_name =
        data.cce_in === 'my' && data.document_type === 'Marriage'
            ? data.name_owner
            : 'N/A'

    let name_owner =
        data.cce_in === 'my' && data.document_type === 'Marriage'
            ? 'N/A'
            : data.name_owner

    let relation_owner =
        data.cce_in === 'my' && data.document_type === 'Marriage'
            ? 'N/A'
            : data.relation_owner

    let error_in_my = data.cce_in === 'my' ? true : false
    let error_in_the = data.cce_in === 'the' ? true : false

    let granted = data.action === 'Granted' ? true : false
    let denied = data.action === 'Denied' ? true : false

    doc.render({
        petition_number: petitioner_number,
        petitioner_name: petitioner_name,
        nationality: data.nationality,
        petitioner_address: petitioner_addressFormatted,

        // For Birth Certificate
        my: error_in_my,
        the: error_in_the,

        // Working Marriage, Death and Birth
        name_spouse: spouse_name,
        name_owner: name_owner,
        relation_owner: relation_owner,
        // Working Marriage, Death  and Birth

        date_of: data.date_of,
        at_city: data.at_city, // at city
        at_province: data.at_province,
        at_country: data.at_country,
        registry_number: data.registry_number,
        reason: data.reason,

        // Errors Table
        clerical: clerical_errors.errors,
        // Supporting Documents Table
        support: supporting_documents.list,

        LCRO_city: data.LCRO_city,
        LCRO_province: data.LCRO_province,

        day_ss: day_ss,
        monthyear_ss: monthyear_ss,
        place_ss: data.SwornCity,
        Ctc: data.Ctc,
        CtcIssuedAt: data.CtcIssuedAt,
        CtcIssuedOn: data.CtcIssuedOn,
        administering_officer: data.administering_officer,
        administering_position: data.administering_position,
        decision: rawXML,

        granted: granted,
        denied: denied,

        ActionDate: data.date_granted,
        mcr: data.mcr,

        amount_paid: data.amount_paid,
        or_number: data.or_number,
        DatePaid: data.DatePaid,

        // Change First Name Tags
        from: data.from,
        to: data.to,
        firstname: data.ground_b,
        specify: data.ground_f,

        // Grounds
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,

        // Change First Name Tags
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(`${folderPath + '/'}Petition.docx`, buf)

    return true
}

async function record_sheet(data) {

    const clerical = JSON.parse(data.clerical_errors)
    const clerical_errors = {
        errors: clerical.description.map((description, index) => ({
            description,
            from: clerical.from[index],
            to: clerical.to[index],
        })),
    }

    const content = fs.readFileSync(
        path.resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/record sheet.docx'
        ),
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let document_owner = ''
    if ((data.name_owner = 'N/A')) {
        document_owner = data.petitioner_name
    } else {
        document_owner = data.name_owner
    }

    let type_of_document = ''
    if (data.document_type === 'Birth') {
        type_of_document = 'Certificate of Live Birth'
    } else if (data.document_type === 'Marriage') {
        type_of_document = 'Certificate of Marriage'
    } else if (data.document_type === 'Death') {
        type_of_document = 'Certificate of Death'
    }

    let type_of_petition = ''
    if (data.type === 'CCE') {
        type_of_petition = 'Correction of Clerical Error'
    } else if (data.type === 'CFN') {
        type_of_petition = 'Change of First Name'
    }

    const start_date_posting = dateFns.format(
        data.certificate_posting_start,
        'dd MMMM yyyy'
    )
    const end_date_posting = dateFns.format(
        data.certificate_posting_end,
        'dd MMMM yyyy'
    )

    const granted_date = dateFns.format(data.date_granted, 'dd MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        date_receipt: data.DatePaid,
        petitioner_name: data.petitioner_name,
        document_owner: document_owner,
        type_document: type_of_document,
        type_petition: type_of_petition,
        start_date_posting: start_date_posting,
        end_date_posting: end_date_posting,
        clerical: clerical_errors.errors,
        reg_num: data.registry_number,
        date_rendered: granted_date,
        mcr: data.mcr,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(`${folderPath + '/'}Record Sheet.docx`, buf)

    return true
}

async function posting(data) {
    const content = fs.readFileSync(
        path.resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/notice and certificate.docx'
        ),
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    let document_owner = ''
    if ((data.name_owner = 'N/A')) {
        document_owner = data.petitioner_name
    } else {
        document_owner = data.name_owner
    }

    let type_of_document = ''
    if (data.document_type === 'Birth') {
        type_of_document = 'Certificate of Live Birth'
    } else if (data.document_type === 'Marriage') {
        type_of_document = 'Certificate of Marriage'
    } else if (data.document_type === 'Death') {
        type_of_document = 'Certificate of Death'
    }

    let type_of_petition = ''
    if (data.type === 'CCE') {
        type_of_petition = 'Correction of Clerical Error'
    } else if (data.type === 'CFN') {
        type_of_petition = 'Change of First Name'
    }

    const start_date_posting = dateFns.format(
        data.certificate_posting_start,
        'dd MMMM yyyy'
    )

    const date_filed = dateFns.format(
        data.certificate_posting_end,
        'dd MMMM yyyy'
    )

    const end_date_posting = dateFns.format(
        data.certificate_posting_end,
        'dd MMMM yyyy'
    )

    const issued_at_LCRO = data.LCRO_city + ', ' + data.LCRO_province
    const day = dateFns.format(data.date_issued, 'do')
    const monthyear = dateFns.format(data.date_issued, 'MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        date_filed: date_filed,
        petitioner_name: data.petitioner_name,
        reg_num: data.registry_number,
        document_owner: document_owner,
        type_document: type_of_document,
        petition_type: type_of_petition,
        mcr: data.mcr,
        date_notice: data.notice_posting,

        issued_at: issued_at_LCRO,
        day: day,
        monthyear: monthyear,

        from: start_date_posting, // Posting
        to: end_date_posting, // Posting
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    })

    fs.writeFileSync(
        `${folderPath + '/'}Cert. of Posting and Notice of Posting.docx`,
        buf
    )

    return true
}
