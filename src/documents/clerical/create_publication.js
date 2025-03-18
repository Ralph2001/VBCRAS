const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')

const PATHS = {
    PUBLICATION_LETTER_CFN: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Publication/CFN.docx').replace('app.asar', 'app.asar.unpacked'),
    PUBLICATION_LETTER_10172: path.resolve(__dirname, '../../resources/documents/RA 9048 RA 10172/Publication/RA10172.docx').replace('app.asar', 'app.asar.unpacked'),
}


let main_folder_path


export async function publication_letter(data) {

}