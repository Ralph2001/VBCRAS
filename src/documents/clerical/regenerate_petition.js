import { checkFilesExist } from './libs'

const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const dateFns = require('date-fns')


/* {
    "action_taken_date": "2025-03-21",
    "administering_officer_name": "ISMAEL D. MALICDEM, JR.",
    "administering_officer_position": "Municipal Civil Registrar",
    "amount_paid": "₱1,200.00",
    "certificate_posting_end": "2025-03-17",
    "certificate_posting_start": "2025-03-07",
    "clerical_errors": [
        {
            "description": "Child's first name",
            "error_description_from": "RALPH",
            "error_description_to": "RALPH",
            "error_num": "6",
            "id": 1
        }
    ],
    "created_at": "2025-03-05T09:26:00.482148",
    "created_by": 1,
    "created_by_user": {
        "position": null,
        "username": "Admin"
    },
    "date_filed": "2025-03-05",
    "date_paid": "2025-03-05",
    "document_owner": "N/A",
    "event_country": "Philippines",
    "event_date": "2001-05-16",
    "event_municipality": "Bayambang",
    "event_province": "Pangasinan",
    "event_type": "Birth",
    "exhibiting_his_her": "Community Tax Certificate No.",
    "exhibiting_number": "98346938",
    "file_path": "C:\\Petitions\\Admin\\9048\\CCE Birth\\2025\\CCE-0001-2025  - RALPH ADVINCULA VILLANUEVA",
    "filing_city_municipality": "Bayambang",
    "filing_province": "Pangasinan",
    "first_name_from": "",
    "first_name_to": "",
    "ground_a": false,
    "ground_b": false,
    "ground_b_data": "",
    "ground_c": false,
    "ground_d": false,
    "ground_e": false,
    "ground_f": false,
    "ground_f_data": "",
    "header_municipality": "MUNICIPALITY OF BAYAMBANG",
    "header_province": "Pangasinan",
    "id": 1,
    "is_indigent": false,
    "is_migrant": false,
    "issued_at": "Bayambang, Pangasinan",
    "issued_on": "2025-03-05",
    "municipal_civil_registrar": "ISMAEL D. MALICDEM, JR.",
    "nationality": "Filipino",
    "notice_posting": "2025-03-06",
    "o_r_number": "9865289",
    "petition_actions": [
        {
            "action_decision": "Granted",
            "action_text": "Finding the petition sufficient in form and substance, the same is hereby GRANTED, the child's first name from \"RALPH\" to \"RALPH\" is hereby corrected.",
            "error_num": 1,
            "id": 1
        }
    ],
    "petition_date_granted": "2025-03-21",
    "petition_date_issued": "2025-03-18",
    "petition_number": "CCE-0001-2025 ",
    "petition_type": "CCE",
    "petitioner_address": "Anulid, Alcala, Pangasinan",
    "petitioner_error_in": "my",
    "petitioner_name": "RALPH ADVINCULA VILLANUEVA",
    "publication_end": "",
    "publication_newspaper": "",
    "publication_place": "",
    "publication_start": "",
    "registry_number": "2001-16",
    "relation_owner": "N/A",
    "remarks": null,
    "republic_act_number": "9048",
    "spouse_name": "",
    "status": "FINISHED",
    "subscribe_sworn_city_municipality": "Bayambang, Pangasinan",
    "subscribe_sworn_date": "2025-03-05",
    "supporting_documents": [
        {
            "document_name": "Child's COLB to be corrected by PSA",
            "id": 1
        }
    ]
} */


// CHANGEABLE FOLDER PATH
// USED IN RETURNING THE RESULT FILEPATH
let main_folder_path

// MAIN FUNCTION THAT GENERATE ALL
// PASSES THE DATA TO OTHER FUNCTION AND WHEN DONE RETURN RESULT
// EXPORT THIS
async function generate(formData) {
    try {
        // CHECK THE FILES BEFORE PROCEEDING
        checkFilesExist([
            PETITION_TEMPLATE_PATHS.LIVEBIRTH,
            PETITION_TEMPLATE_PATHS.MARRIAGE,
            PETITION_TEMPLATE_PATHS.DEATH,
            PETITION_TEMPLATE_PATHS.CFN,
            PETITION_TEMPLATE_PATHS.CFN,
            PETITION_TEMPLATE_PATHS.CCE10172
        ])
        checkFilesExist([
            ADDITIONAL_FILES_TEMPLATE.ENDORSEMENT_LETTER,
            ADDITIONAL_FILES_TEMPLATE.POSTING,
            ADDITIONAL_FILES_TEMPLATE.RECORD_SHEET
        ])

        // const data = formData

        const data = JSON.parse(formData)

        // PASS THE DATA TO THE FUNCTIONS
        try {
            await document_folder(data)
            // await petition(data)
            await endorsement_letter(data)
            // await record_sheet(data)
            // await posting(data)
        } catch (error) {
            console.log(error)
        }

        return { status: true, filepath: main_folder_path }
    } catch (error) {
        console.log(error)
        return { status: false, error: error.message }
    }
}

// CREATE ENDORSEMENT LETTER FOR ALL PETITION
// USING THE ENDORSEMENT LETTER TEMPLATE ABOVE
async function endorsement_letter(data) {
    const content = fs.readFileSync(
        ADDITIONAL_FILES_TEMPLATE.ENDORSEMENT_LETTER,
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })

    doc.render({
        date: data.granted_date,
        petition_type: data.type_of_petition,
        event_type: data.type_of_document,
        document_owner: data.document_owner,
        mcr: data.municipal_civil_registrar,
        subject_code: subject_code
    })

    saveDocument(doc, 'Endorsement Letter.docx', main_folder_path)
    return true
}

// CREATE PETITION FILE BASED ON SELECTED
// PETITION TYPE, EVENT TYPE AND REPUBLIC ACT
async function petition(data) {

    // READ THE NEEDED PETITION FILE BASED ON SELECTED DATA
    const content = await PetitionFile(
        data.republic_act_number,
        data.petition_type,
        data.event_type
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })

    const day_ss = dateFns.format(data.subscribe_sworn_date, 'do')
    const monthyear_ss = dateFns.format(data.subscribe_sworn_date, 'MMMM yyyy')

    // Document Owner and Relation based on petitioner error in and event type
    // IF EVENT TYPE IS MARRIAGE AND PETITIONER ERROR IN IS MY
    // THE DOCUMENT OWNER TAG WILL BE SPOUSE NAME
    // BUT IF MARRIAGE AND PETITIONER ERROR IN IS THE
    // THE SPOUSE WILL BE N/A

    const spouse_name =
        data.petitioner_error_in === 'my' && data.event_type === 'Marriage'
            ? data.spouse_name
            : 'N/A'

    // Parang may mali dito
    const document_owner =
        data.petitioner_error_in === 'my' ? 'N/A' : data.document_owner

    const relation_owner =
        data.petitioner_error_in === 'my' && data.event_type === 'Marriage'
            ? 'N/A'
            : data.relation_owner

    const error_in_my = data.petitioner_error_in === 'my' ? true : false
    const error_in_the = data.petitioner_error_in === 'the' ? true : false

    // This is for Single Action Data
    const granted =
        data.petition_actions[0].action_decision === 'Granted' ? true : false
    const denied =
        data.petition_actions[0].action_decision === 'Denied' ? true : false

    // Dates formatted
    const event_date = dateFns.format(data.event_date, 'MMMM dd, yyyy')
    const issued_on = dateFns.format(data.issued_on, 'MMMM dd, yyyy')

    const date_granted = !data.is_migrant
        ? dateFns.format(data.action_taken_date, 'MMMM dd, yyyy')
        : ''

    const date_paid =
        data.date_paid === 'Indigent' || data.is_indigent
            ? data.date_paid
            : dateFns.format(data.date_paid, 'MMMM dd, yyyy')

    // Could be better?
    // Task: Auto Bold text inside quotation marks
    // Or Nah
    const solo_action = data.petition_actions[0].action_text

    const petition_num = data.is_migrant ? '' : data.petition_number
    const migrant_pet = data.is_migrant
        ? `Migrant Petition (${data.petition_number})`
        : ''

    // IF MIGRANT LEAVE IT BLANK
    const municipal_civil_registrar = data.is_migrant
        ? ''
        : data.municipal_civil_registrar

    doc.render({
        header_province: data.header_province,
        header_municipality: data.header_municipality,

        petition_number: petition_num,
        migrant: migrant_pet,

        petitioner_name: data.petitioner_name,
        nationality: data.nationality,
        petitioner_address: data.petitioner_address,
        my: error_in_my,
        the: error_in_the,

        // Document Owner and Relation
        spouse: spouse_name,
        document_owner: document_owner,
        relation_owner: relation_owner,

        // Event
        event_date: event_date,
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

        exhibiting_his_her: data.exhibiting_his_her,
        exhibiting_number: data.exhibiting_number,
        // community_tax_certificate: data.community_tax_certificate,

        issued_at: data.issued_at,
        issued_on: issued_on,

        administering_officer: data.administering_officer_name,
        administering_position: data.administering_officer_position,

        granted: granted,
        denied: denied,

        action_date: date_granted,
        decision: solo_action,
        // decision: '<w:p>' + toOOXML(data.petition_actions[0].action_text) + '</w:p>',
        municipal_civil_registrar: municipal_civil_registrar,

        o_r_number: data.o_r_number,
        amount_paid: data.amount_paid,
        date_paid: date_paid,

        // Change of First Name {{Tags}}
        from: data.first_name_from,
        to: data.first_name_to,
        a: data.ground_a,
        b: data.ground_b,
        c: data.ground_c,
        d: data.ground_d,
        e: data.ground_e,
        f: data.ground_f,
        b_data: data.ground_b_data,
        f_data: data.ground_f_data,

        // CCE 10172
        reasons: data.reasons,
        actions: data.petition_actions
    })

    saveDocument(doc, 'Petition.docx', main_folder_path)
    console.log(saveDocument)
    return true
}



// CREATE RECORD SHEET FOR ALL PETITION TYPE
// USING THE TEMPLATE ABOVE
// OPTIONAL ONLY?? NAH
async function record_sheet(data) {
    const content = fs.readFileSync(
        ADDITIONAL_FILES_TEMPLATE.RECORD_SHEET,
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })
    const date_paid = dateFns.format(data.date_filed, 'MMMM dd, yyyy')
    const document_owner =
        data.document_owner === 'N/A' || data.document_owner === ''
            ? data.petitioner_name
            : data.document_owner

    const type_of_document =
        data.event_type === 'Birth'
            ? 'Certificate of Live Birth'
            : data.event_type === 'Marriage'
                ? 'Certificate of Marriage'
                : data.event_type === 'Death'
                    ? 'Certificate of Death'
                    : ''
    const type_of_petition =
        data.petition_type === 'CCE'
            ? 'Correction of Clerical Error'
            : data.petition_type === 'CFN'
                ? 'Change of First Name'
                : ''
    const start_date_posting = dateFns.format(
        data.certificate_posting_start,
        'dd MMMM yyyy'
    )
    const end_date_posting = dateFns.format(
        data.certificate_posting_end,
        'dd MMMM yyyy'
    )
    const granted_date = dateFns.format(
        data.petition_date_granted,
        'dd MMMM yyyy'
    )
    const first_name_from = data.first_name_from
    const first_name_to = data.first_name_to

    let clerical_errors
    if (data.petition_type === 'CCE') {
        clerical_errors = data.clerical_errors
    } else if (data.petition_type === 'CFN') {
        const main_value = [
            {
                error_num: '1',
                description: 'Change of First Name',
                error_description_from: first_name_from,
                error_description_to: first_name_to
            }
        ]

        clerical_errors = main_value
    }

    const publication_start =
        data.petition_type === 'CFN' || data.republic_act_number === '10172'
            ? dateFns.format(data.publication_start, 'dd MMMM yyyy')
            : ''

    const publication_end =
        data.petition_type === 'CFN' || data.republic_act_number === '10172'
            ? dateFns.format(data.publication_end, 'dd MMMM yyyy')
            : ''

    const publication =
        data.petition_type === 'CFN' || data.republic_act_number === '10172'
            ? `${publication_start} to ${publication_end}`
            : 'N/A'

    doc.render({
        petition_number: data.petition_number,
        date_receipt: date_paid,
        petitioner_name: data.petitioner_name,
        document_owner: document_owner,
        type_document: type_of_document,
        type_petition: type_of_petition,

        publication: publication,

        start_date_posting: start_date_posting,
        end_date_posting: end_date_posting,
        clerical: clerical_errors,
        reg_num: data.registry_number,
        date_rendered: granted_date,
        mcr: data.municipal_civil_registrar
    })

    saveDocument(doc, 'Record Sheet.docx', main_folder_path)

    return true
}

// CREATE NOTICE OF POSTING AND CERTIFICATE OF POSTING FOR ALL PETITION TYPE
// USING THE TEMPLATE ABOVE
async function posting(data) {
    const content = fs.readFileSync(ADDITIONAL_FILES_TEMPLATE.POSTING, 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })

    const document_owner =
        data.document_owner === 'N/A' || data.document_owner === ''
            ? data.petitioner_name
            : data.document_owner
    const type_of_document =
        data.event_type === 'Birth'
            ? 'Certificate of Live Birth'
            : data.event_type === 'Marriage'
                ? 'Certificate of Marriage'
                : data.event_type === 'Death'
                    ? 'Certificate of Death'
                    : ''
    const type_of_petition =
        data.petition_type === 'CCE'
            ? 'Correction of Clerical Error'
            : data.petition_type === 'CFN'
                ? 'Change of First Name'
                : ''
    const start_date_posting = dateFns.format(
        data.certificate_posting_start,
        'dd MMMM yyyy'
    )
    const end_date_posting = dateFns.format(
        data.certificate_posting_end,
        'dd MMMM yyyy'
    )

    const date_filed = dateFns.format(data.date_filed, 'dd MMMM yyyy')
    const notice_posting = dateFns.format(data.notice_posting, 'MMMM dd, yyyy')

    const issued_at_filing_location =
        data.filing_city_municipality + ', ' + data.filing_province

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
        to: end_date_posting
    })

    saveDocument(doc, 'Posting.docx', main_folder_path)
    return true
}

export { generate }
