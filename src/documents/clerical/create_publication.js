const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')
const os = require('os')

const PATHS = {
    PUBLICATION_LETTER_CFN: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Publication/CFN.docx'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    PUBLICATION_LETTER_10172: path
        .resolve(
            __dirname,
            '../../resources/documents/RA 9048 RA 10172/Publication/RA10172.docx'
        )
        .replace('app.asar', 'app.asar.unpacked')
}

let main_folder_path

export async function create_publication_letter(data) {
    const content =
        data.petition_type === 'CFN'
            ? fs.readFileSync(PATHS.PUBLICATION_LETTER_CFN, 'binary')
            : data.republic_act_number === '10172'
              ? fs.readFileSync(PATHS.PUBLICATION_LETTER_10172, 'binary')
              : null

    if (!content) {
        return { success: false, message: 'Invalid petition type' }
    }

    try {
        await publication_letter(data, content)
        return { success: true, filepath: main_folder_path }
    } catch (error) {
        console.log(error)
        return { success: false, message: 'An error occurred' }
    }
}

// FUNCTION THAT SAVE THE DOCUMENT
function saveDocument(doc, fileName, folderPath) {
    const userBasePath = os.homedir()

    // Ensure folderPath is absolute, resolve from userBasePath if not
    const finalFolderPath = path.isAbsolute(folderPath)
        ? folderPath
        : path.join(userBasePath, folderPath)

    // Ensure directory exists
    fs.mkdirSync(finalFolderPath, { recursive: true })

    main_folder_path = path.join(folderPath, 'Publication Letter.docx')
    const fullPath = path.join(finalFolderPath, fileName)

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    })

    fs.writeFileSync(fullPath, buf)
}

async function publication_letter(data, content) {
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    })

    const document_owner =
        data.document_owner === 'N/A'
            ? data.petitioner_name
            : data.document_owner
    const petitioner_name = data.petitioner_name
    const first_name = data.first_name_from
    const new_name = data.first_name_to

    doc.render({
        petition_number: data.petition_number,
        date_filed: dateFns.format(data.date_filed, 'MMMM dd, yyyy'),
        petitioner_name: petitioner_name.toUpperCase(),
        first_name: first_name.toUpperCase(),
        new: new_name.toUpperCase(),
        document_owner: document_owner.toUpperCase(),
        date_birth: dateFns.format(data.event_date, 'dd MMMM yyyy'),
        place_birth: data.event_municipality + ', ' + data.event_province,
        name_father: data.name_father,
        name_mother: data.name_mother,

        publication_end: dateFns.format(data.publication_end, 'dd MMMM yyyy'),
        newspaper_name: data.publication_newspaper,
        place_publication: data.publication_place,
        publication_from: dateFns.format(
            data.publication_start,
            'MMMM dd, yyyy'
        ),
        publication_and: dateFns.format(data.publication_and, 'MMMM dd, yyyy'),

        civil_registrar: data.municipal_civil_registrar,
        civil_registrar_position: 'Municipal Civil Registrar'
    })

    saveDocument(doc, 'Publication Letter.docx', data.file_path)
    return true
}
