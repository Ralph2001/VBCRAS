const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const dateFns = require('date-fns')
import toOOXML from '../renderer/src/utils/toOOXML'

// CHANGEABLE FOLDER PATH
// USED IN RETURNING THE RESULT FILEPATH
let main_folder_path

// FILE PATHS HERE
// DOCX FORMAT ONLY 
// NAME OF TEMPLATE COULD BE BETTER
const PETITION_TEMPLATE_PATHS = {
    LIVEBIRTH: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Live Birth/petition.docx'),
    DEATH: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Death/petition.docx'),
    MARRIAGE: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Marriage/petition.docx'),
    CFN: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Change First Name/petition.docx'),
    CCE10172: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Live Birth/petition_RA_10172.docx'),
};

const ADDITIONAL_FILES_TEMPLATE = {
    ENDORSEMENT_LETTER: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/endorsement.docx'),
    RECORD_SHEET: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/record sheet.docx'),
    POSTING: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/notice and certificate.docx')
}
// FUNCTION THAT CHECKS THE FILES 
// COULD BE BETTER, IDK
function checkFilesExist(paths) {
    for (const filePath of paths) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
    }
    // RETURN TRUE IF FILES EXISTED
    return true;
}

// FUNCTION THAT SAVE THE DOCUMENT 
// NEEDED FOR ALL FUNCTION
function saveDocument(doc, fileName, folderPath) {
    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });
    fs.writeFileSync(path.join(folderPath, fileName), buf);
}

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
        ]);
        checkFilesExist([
            ADDITIONAL_FILES_TEMPLATE.ENDORSEMENT_LETTER,
            ADDITIONAL_FILES_TEMPLATE.POSTING,
            ADDITIONAL_FILES_TEMPLATE.RECORD_SHEET
        ]);

        const data = JSON.parse(formData);

        // PASS THE DATA TO THE FUNCTIONS
        await document_folder(data);
        await petition(data);
        await endorsement_letter(data);
        await record_sheet(data);
        await posting(data);

        return { status: true, filepath: main_folder_path };

    } catch (error) {
        console.error("Error during generation:", error);
        return { status: false, error: error.message };
    }
}

// FIRST CREATE DOCUMENT FOLDER BEFORE 
// GENERATING NEW DOCUMENTS
// MAKE ADJUSTMENTS IN FILE DIRECTORY
async function document_folder(data) {
    var folderCreation = path.join(
        __dirname,
        '../../resources/documents/Generated/Correction of Clerical Error'
    )
    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }
    main_folder_path = folderCreation
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
        '10172-CCE-Birth': PETITION_TEMPLATE_PATHS.CCE10172,
    };

    const key = `${republic_act_number}-${petition_type}-${event_type}`;
    const filePath = pathMap[key];

    return filePath ? fs.readFileSync(filePath, 'binary') : '';
}

// CREATE ENDORSEMENT LETTER FOR ALL PETITION
// USING THE ENDORSEMENT LETTER TEMPLATE ABOVE
async function endorsement_letter(data) {
    const content = fs.readFileSync(ADDITIONAL_FILES_TEMPLATE.ENDORSEMENT_LETTER, 'binary')

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

    saveDocument(doc, "Endorsement Letter.docx", main_folder_path);
    return true
}

// CREATE PETITION FILE BASED ON SELECTED
// PETITION TYPE, EVENT TYPE AND REPUBLIC ACT 
async function petition(data) {
    // READ THE NEEDED PETITION FILE BASED ON SELECTED DATA
    const content = await PetitionFile(data.republic_act_number, data.petition_type, data.event_type)

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    const day_ss = dateFns.format(data.subscribe_sworn_date, 'do')
    const monthyear_ss = dateFns.format(data.subscribe_sworn_date, 'MMMM yyyy')

    // Document Owner and Relation based on petitioner error in and event type
    // IF EVENT TYPE IS MARRIAGE AND PETITIONER ERROR IN IS MY
    // THE DOCUMENT OWNER TAG WILL BE SPOUSE NAME
    // BUT IF MARRIAGE AND PETITIONER ERROR IN IS THE 
    // THE SPOUSE WILL BE N/A

    const spouse_name = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? data.document_owner : 'N/A'
    const document_owner = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? 'N/A' : data.document_owner
    const relation_owner = data.petitioner_error_in === 'my' && data.event_type === 'Marriage' ? 'N/A' : data.relation_owner

    const error_in_my = data.petitioner_error_in === 'my' ? true : false
    const error_in_the = data.petitioner_error_in === 'the' ? true : false

    // This is for Single Action Data
    const granted = data.petition_actions[0].action_decision === 'Granted' ? true : false
    const denied = data.petition_actions[0].action_decision === 'Denied' ? true : false


    // Dates formatted
    const event_date = dateFns.format(data.event_date, 'MMMM dd, yyyy')
    const issued_on = dateFns.format(data.issued_on, 'MMMM dd, yyyy')
    const date_granted = dateFns.format(data.action_taken_date, 'MMMM dd, yyyy')
    const date_paid = dateFns.format(data.date_paid, 'MMMM dd, yyyy')

    // Could be better?
    // Task: Auto Bold text inside quotation marks
    // Or Nah
    const solo_action = data.petition_actions[0].action_text.replace(`"`, '“').replace(`"`, '”')

    doc.render({
        petition_number: data.petition_number,
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
        community_tax_certificate: data.community_tax_certificate,
        issued_at: data.issued_at,
        issued_on: issued_on,

        administering_officer: data.administering_officer_name,
        administering_position: data.administering_officer_position,

        granted: granted,
        denied: denied,

        action_date: date_granted,
        decision: solo_action,
        // decision: '<w:p>' + toOOXML(data.petition_actions[0].action_text) + '</w:p>',
        municipal_civil_registrar: data.municipal_civil_registrar,

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

    saveDocument(doc, "Petition.docx", main_folder_path);
    return true
}

// CREATE RECORD SHEET FOR ALL PETITION TYPE
// USING THE TEMPLATE ABOVE
// OPTIONAL ONLY?? NAH
async function record_sheet(data) {
    const content = fs.readFileSync(ADDITIONAL_FILES_TEMPLATE.RECORD_SHEET, 'binary')

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })
    const date_paid = dateFns.format(data.petition_date_granted, 'MMMM dd, yyyy')
    const document_owner = data.document_owner === 'N/A' || data.document_owner === '' ? data.petitioner_name : data.document_owner
    const type_of_document = data.event_type === 'Birth' ? 'Certificate of Live Birth' : data.event_type === 'Marriage' ? 'Certificate of Marriage' : data.event_type === 'Death' ? 'Certificate of Death' : ''
    const type_of_petition = data.petition_type === 'CCE' ? 'Correction of Clerical Error' : data.petition_type === 'CFN' ? 'Change of First Name' : ''
    const start_date_posting = dateFns.format(data.certificate_posting_start, 'dd MMMM yyyy')
    const end_date_posting = dateFns.format(data.certificate_posting_end, 'dd MMMM yyyy')
    const granted_date = dateFns.format(data.petition_date_granted, 'dd MMMM yyyy')

    doc.render({
        petition_number: data.petition_number,
        date_receipt: date_paid,
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

    saveDocument(doc, "Record Sheet.docx", main_folder_path);

    return true
}

// CREATE NOTICE OF POSTING AND CERTIFICATE OF POSTING FOR ALL PETITION TYPE
// USING THE TEMPLATE ABOVE
async function posting(data) {
    const content = fs.readFileSync(ADDITIONAL_FILES_TEMPLATE.POSTING, 'binary')

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

    saveDocument(doc, "Posting.docx", main_folder_path);
    return true
}

export { generate }