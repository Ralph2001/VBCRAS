import toOOXML from '../renderer/src/utils/toOOXML'

const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const dateFns = require('date-fns')

// const libre = require('libreoffice-convert')
// libre.convertAsync = require('util').promisify(libre.convert)

export async function generate(formData) {
    const data = JSON.parse(formData)

    const folderCreation = await document_folder(data)
    const petitionCreation = await petition(data)
    const endorsement_letterCreation = await endorsement_letter(data)
    const record_sheetCreation = await record_sheet(data)
    const notice_and_certificate_posting = await posting(data)
    // const convertThisToPDF = await ConvertMultipleFiles()

    return { status: true, filepath: null }
}

// File Paths Here
const LIVEBIRTH_PATH = path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Live Birth/petition.docx')
const DEATH_PATH = path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Death/petition.docx')
const MARRIAGE_PATH = path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Marriage/petition.docx')
const CFN_PATH = path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Change First Name/petition.docx')
const CCE10172_PATH = path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Live Birth/petition_RA_10172.docx')

let main_folder_path

async function PetitionFile(republic_act_number, petition_type, event_type) {
    console.log(republic_act_number, petition_type, event_type)
    let content = ''
    if ((republic_act_number === '9048') & (petition_type === 'CCE') & (event_type === 'Birth')) {
        content = fs.readFileSync(LIVEBIRTH_PATH, 'binary')
    } else if (
        (republic_act_number === '9048') &
        (petition_type === 'CCE') &
        (event_type === 'Marriage')
    ) {
        content = fs.readFileSync(MARRIAGE_PATH, 'binary')
    } else if (
        (republic_act_number === '9048') &
        (petition_type === 'CCE') &
        (event_type === 'Death')
    ) {
        content = fs.readFileSync(DEATH_PATH, 'binary')
    } else if (
        (republic_act_number === '9048') &
        (petition_type === 'CFN') &
        (event_type === 'Birth')
    ) {
        content = fs.readFileSync(CFN_PATH, 'binary')
    } else if (
        (republic_act_number === '10172') &
        (petition_type === 'CCE') &
        (event_type === 'Birth')
    ) {
        content = fs.readFileSync(CCE10172_PATH, 'binary')
    }
    return content
}

async function document_folder(data) {
    // const date_now = new Date()
    // const doctype = data.type
    // const petitioner_name = data.petitioner_name

    var folderCreation = path.join(
        __dirname,
        '../../resources/documents/Generated/Correction of Clerical Error'
    )
    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }

    main_folder_path = folderCreation

    // var folderCreation = `C:/VBCRAS/${
    //     date_now.getFullYear() + '/' + doctype + ' ' + petitioner_name
    // }`

    // main_folder_path = `C:/VBCRAS/${
    //     date_now.getFullYear() + '/' + doctype + ' ' + petitioner_name
    // }/`

    return true
}

// Goods 
async function endorsement_letter(data) {
    const content = fs.readFileSync(path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/endorsement.docx'), 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const document_owner = data.document_owner === 'N/A' || data.document_owner === '' ? data.petitioner_name : data.document_owner
    const type_of_document = data.event_type === 'Birth' ? 'Certificate of Live Birth' : data.event_type === 'Marriage' ? 'Certificate of Marriage' : data.event_type === 'Death' ? 'Certificate of Death' : ''
    const type_of_petition = data.petition_type === 'CCE' ? 'Correction of Clerical Error' : data.petition_type === 'CFN' ? 'Change of First Name' : ''
    const granted_date = dateFns.format(data.petition_date_granted, 'dd MMMM yyyy')
    const subject_code = data.republic_act_number === '9048' ? 'R.A 9048' : data.republic_act_number === '10172' ? 'R.A 10172' : ''

    doc.render({
        date: granted_date,
        petition_type: type_of_petition,
        event_type: type_of_document,
        document_owner: document_owner,
        mcr: data.municipal_civil_registrar,
        subject_code: subject_code
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        // compression: 'DEFLATE',
    })

    fs.writeFileSync(main_folder_path + "/Endorsement Letter.docx", buf);
    return true
}

//
async function petition(data) {
    const content = await PetitionFile(data.republic_act_number, data.petition_type, data.event_type)

    // const support = JSON.parse(data.supportingDocuments)
    // const supporting_documents = {
    //     list: [...support].map((supportName) => ({
    //         name: supportName,
    //     })),
    // }

    // const clerical = JSON.parse(data.clerical_errors)
    // const clerical_errors = {
    //     errors: clerical.description.map((description, index) => ({
    //         description,
    //         from: clerical.from[index],
    //         to: clerical.to[index],
    //     })),
    // }

    // const grounds_filing = JSON.parse(data.grounds)
    // const grounds = {
    //     a: grounds_filing.a,
    //     b: grounds_filing.b,
    //     c: grounds_filing.c,
    //     d: grounds_filing.d,
    //     e: grounds_filing.e,
    //     f: grounds_filing.f,
    // }

    // let a = grounds_filing.a ? true : false
    // let b = grounds_filing.b ? true : false
    // let c = grounds_filing.c ? true : false
    // let d = grounds_filing.d ? true : false
    // let e = grounds_filing.e ? true : false
    // let f = grounds_filing.f ? true : false

    // const datareason = JSON.parse(data.reasons)
    // const reasons = {
    //     list: [...datareason].map((reasonName) => ({
    //         nameofreason: reasonName,
    //     })),
    // }


    // const dataactions = JSON.parse(data.action_taken)
    // const actions = {
    //     list: dataactions.action.map((action, index) => ({
    //         action,
    //         decision: dataactions.decision[index],
    //     })),
    // }

    // const date_now = new Date()
    // const number = data.petition_number
    // const doctype = data.type

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const petitioner_name = data.petitioner_name
    const petitioner_number = data.petition_number

    // What is this??
    // const rawXML = `'` + data.decision + `'`

    const day_ss = dateFns.format(data.subscribe_sworn_date, 'do')
    const monthyear_ss = dateFns.format(data.subscribe_sworn_date, 'MMMM yyyy')


    let spouse_name = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? data.document_owner : 'N/A'
    let document_owner = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? 'N/A' : data.document_owner
    let relation_owner = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? 'N/A' : data.relation_owner

    let error_in_my = data.petitioner_error_in === 'my' ? true : false
    let error_in_the = data.petitioner_error_in === 'the' ? true : false

    // This is for Single Action Data
    let granted = data.petition_actions[0].action_decision === 'Granted' ? true : false
    let denied = data.petition_actions[0].action_decision === 'Denied' ? true : false

    doc.render({
        petition_number: data.petition_number,
        petitioner_name: data.petitioner_name,
        nationality: data.nationality,
        petitioner_address: data.petitioner_address,
        my: error_in_my,
        the: error_in_the,

        spouse: data.document_owner, // for 9048 CCE Marriage
        document_owner: data.document_owner,
        
        relation_owner: data.relation_owner,
        event_date: data.event_date,
        event_country: data.event_country,
        event_province: data.event_province,
        event_municipality: data.event_municipality,
        registry_number: data.registry_number,

        // Clerical Errors
        clerical: data.clerical_errors,
        reason: data.reasons[0].reason,

        // decision

        // Supporting Documents
        supports: data.supporting_documents,

        filing_city: data.filing_city_municipality,
        filing_province: data.filing_province,

        day_ss: day_ss,
        month_year_ss: monthyear_ss,
        subscribe_sworn: data.subscribe_sworn_city_municipality,
        community_tax_certificate: data.community_tax_certificate,
        issued_at: data.issued_at,
        issued_on: data.issued_on,

        administering_officer: data.administering_officer_name,
        administering_position: data.administering_officer_position,

        granted: granted,
        denied: denied,

        action_date: data.action_taken_date,
        decision: '<w:p>' + toOOXML(data.petition_actions[0].action_text) + '</w:p>',
        municipal_civil_registrar: data.municipal_civil_registrar,

        o_r_number: data.o_r_number,
        amount_paid: data.amount_paid,
        date_paid: data.date_paid,
    })

    // doc.render({
    //     petition_number: petitioner_number,
    //     petitioner_name: petitioner_name,
    //     nationality: data.nationality,
    //     petitioner_address: data.petitioner_address,

    //     // For Birth Certificate
    //     my: error_in_my,
    //     the: error_in_the,

    //     // Working Marriage, Death and Birth
    //     name_spouse: spouse_name,
    //     name_owner: document_owner,
    //     relation_owner: relation_owner,
    //     // Working Marriage, Death  and Birth

    //     date_of: data.date_of,
    //     at_city: data.at_city, // at city
    //     at_province: data.at_province,
    //     at_country: data.at_country,
    //     registry_number: data.registry_number,
    //     reason: data.reason,

    //     // Errors Table
    //     clerical: clerical_errors.errors,
    //     // Supporting Documents Table
    //     support: supporting_documents.list,

    //     LCRO_city: data.LCRO_city,
    //     LCRO_province: data.LCRO_province,

    //     day_ss: day_ss,
    //     monthyear_ss: monthyear_ss,
    //     place_ss: data.SwornCity,
    //     Ctc: data.Ctc,
    //     CtcIssuedAt: data.CtcIssuedAt,
    //     CtcIssuedOn: data.CtcIssuedOn,
    //     administering_officer: data.administering_officer,
    //     administering_position: data.administering_position,
    //     decision: rawXML,

    //     granted: granted,
    //     denied: denied,

    //     ActionDate: data.date_granted,
    //     mcr: data.mcr,

    //     amount_paid: data.amount_paid,
    //     or_number: data.or_number,
    //     DatePaid: data.DatePaid,

    //     // Change First Name Tags
    //     from: data.from,
    //     to: data.to,
    //     firstname: data.ground_b,
    //     specify: data.ground_f,

    //     // Grounds
    //     a: a,
    //     b: b,
    //     c: c,
    //     d: d,
    //     e: e,
    //     f: f,

    //     // CCE 10172 Tags
    //     reasons: reasons.list,
    //     actions: actions.list,
    // })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        // compression: 'DEFLATE',
    })

    fs.writeFileSync(main_folder_path + "/Petition.docx", buf)
    return true
}

// Goods na to
async function record_sheet(data) {

    const content = fs.readFileSync(path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/record sheet.docx'), 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const document_owner = data.document_owner === 'N/A' || data.document_owner === '' ? data.petitioner_name : data.document_owner
    const type_of_document = data.event_type === 'Birth' ? 'Certificate of Live Birth' : data.event_type === 'Marriage' ? 'Certificate of Marriage' : data.event_type === 'Death' ? 'Certificate of Death' : ''
    const type_of_petition = data.petition_type === 'CCE' ? 'Correction of Clerical Error' : data.petition_type === 'CFN' ? 'Change of First Name' : ''
    const start_date_posting = dateFns.format(data.certificate_posting_start, 'dd MMMM yyyy')
    const end_date_posting = dateFns.format(data.certificate_posting_end, 'dd MMMM yyyy')
    const granted_date = dateFns.format(data.petition_date_granted, 'dd MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        date_receipt: data.date_paid,
        petitioner_name: data.petitioner_name,
        document_owner: document_owner,
        type_document: type_of_document,
        type_petition: type_of_petition,
        start_date_posting: start_date_posting,
        end_date_posting: end_date_posting,
        clerical: data.clerical_errors,
        reg_num: data.registry_number,
        date_rendered: granted_date,
        mcr: data.municipal_civil_registrar,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        // compression: 'DEFLATE',
    })
    fs.writeFileSync(main_folder_path + "/Record Sheet.docx", buf);

    return true
}

// Goods na to
async function posting(data) {
    const content = fs.readFileSync(
        path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/notice and certificate.docx'), 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const document_owner = data.document_owner === 'N/A' || data.document_owner === '' ? data.petitioner_name : data.document_owner
    const type_of_document = data.event_type === 'Birth' ? 'Certificate of Live Birth' : data.event_type === 'Marriage' ? 'Certificate of Marriage' : data.event_type === 'Death' ? 'Certificate of Death' : ''
    const type_of_petition = data.petition_type === 'CCE' ? 'Correction of Clerical Error' : data.petition_type === 'CFN' ? 'Change of First Name' : ''
    const start_date_posting = dateFns.format(data.certificate_posting_start, 'dd MMMM yyyy')
    const end_date_posting = dateFns.format(data.certificate_posting_end, 'dd MMMM yyyy')

    const date_filed = dateFns.format(data.date_filed, 'dd MMMM yyyy')
    const notice_posting = dateFns.format(data.notice_posting, 'MMMM dd, yyyy')

    const issued_at_filing_location = data.filing_city_municipality + ', ' + data.filing_province

    const day = dateFns.format(data.petition_date_issued, 'do')
    const monthyear = dateFns.format(data.petition_date_issued, 'MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        date_filed: date_filed,
        petitioner_name: data.petitioner_name,
        reg_num: data.registry_number,
        document_owner: document_owner,
        type_document: type_of_document,
        petition_type: type_of_petition,
        mcr: data.municipal_civil_registrar,
        date_notice: notice_posting,

        issued_at: issued_at_filing_location,
        day: day,
        monthyear: monthyear,

        // Posting Here
        from: start_date_posting,
        to: end_date_posting,
    })

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        // compression: 'DEFLATE',
    })
    fs.writeFileSync(main_folder_path + "/Posting.docx", buf);
    return true
}
