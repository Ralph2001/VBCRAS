const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const dateFns = require('date-fns')


let main_folder_path;
const LEGITIMATION_PATH = {
    ADULT: path
        .resolve(
            __dirname,
            '../../resources/documents/Legitimation/affidavit 18 above.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
}

function checkFilesExist(paths) {
    for (const filePath of paths) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }
    }
    // RETURN TRUE IF FILES EXISTED
    return true
}

function saveDocument(doc, fileName, folderPath) {
    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    })
    fs.writeFileSync(path.join(folderPath, fileName), buf)
}

async function generate_legitimation(formData) {
    try {
        // CHECK THE FILES BEFORE PROCEEDING
        checkFilesExist([
            LEGITIMATION_PATH.ADULT,
        ])
        const data = JSON.parse(formData)

        // PASS THE DATA TO THE FUNCTIONS
        try {
            await document_folder(data)
            await create_legitimation(data)
        } catch (error) {
            console.log(error)
        }

        return { status: true, filepath: main_folder_path }
    } catch (error) {
        console.log(error)
        return { status: false, error: error.message }
    }
}

function addOrdinalSuffix(day) {
    const j = day % 10;
    const k = day % 100;

    if (j === 1 && k !== 11) {
        return `${day}st`;
    } else if (j === 2 && k !== 12) {
        return `${day}nd`;
    } else if (j === 3 && k !== 13) {
        return `${day}rd`;
    } else {
        return `${day}th`;
    }
}

async function create_legitimation(data) {
    const content = fs.readFileSync(
        LEGITIMATION_PATH.ADULT,
        'binary'
    )

    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })

    const formattedDate = `${addOrdinalSuffix(dateFns.format(data.date_filed, 'd'))} day of ${dateFns.format(data.date_filed, 'MMMM yyyy')}`;
    const child_pronoun = data.child_sex === "Male" ? 'his' : data.child_sex === "Female" ? "her" : ""

    doc.render({
        date_registration: data.date_registration,
        registry_number: data.registry_number,
        name_father: data.name_father,
        name_mother: data.name_mother,
        citizenship: data.citizenship,
        postal_address: data.postal_address,
        child_name: data.child_name,
        date_birth: data.date_birth,
        place_birth: data.place_birth,
        date_marriage: data.date_marriage,
        place_marriage: data.place_marriage,
        before_by: data.before_by,
        registered_at: data.registered_at,
        date_filed: formattedDate,
        place_filed: data.place_filed,
    })

    saveDocument(doc, 'Legitimation 18 above sample.docx', main_folder_path)
    return true

}

async function document_folder(data) {

    var folderCreation = path
        .join(
            __dirname,
            `..\\..\\resources\\temp\\Generated\\`
        )
        .replace('app.asar', 'app.asar.unpacked')
    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true })
    }
    main_folder_path = folderCreation
    return true
}


export { generate_legitimation }