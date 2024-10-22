import { PDFDocument, StandardFonts } from 'pdf-lib'
const path = require('path')
const fs = require('fs')

const MARRIAGE_TEMPLATE_PATHS = {
    NOTICE: path
        .resolve(
            __dirname,
            '../../resources/documents/Marriage License/Notice.pdf'
        )
        .replace('app.asar', 'app.asar.unpacked'),
}

function checkFilesExist(paths) {
    for (const filePath of paths) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }
    }
    return true
}

async function generate_marriage_notice(params) {
    try {
        // Ensure file exists before proceeding
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.NOTICE])

        // Load PDF content without 'binary' encoding
        const content = fs.readFileSync(MARRIAGE_TEMPLATE_PATHS.NOTICE)
        const pdfDoc = await PDFDocument.load(content)
        const form = pdfDoc.getForm()

        // Retrieve form fields
        const left_icon = form.getButton('left_icon')
        const right_icon = form.getButton('right_icon')
        const province = form.getTextField('province')
        const municipality = form.getTextField('municipality')


        const font = await pdfDoc.embedStandardFont(StandardFonts.TimesRomanBold) 
        const office = form.getTextField('office')
        office.setText('LOCAL CIVIL REGISTRY')
        office.updateAppearances(font)




        const groom_name = form.getTextField('groom_name')
        const bride_name = form.getTextField('bride_name')

        // Picture fields
        const groom_picture = form.getButton('groom_picture')
        const bride_picture = form.getButton('bride_picture')

        // Other fields
        const groom_age = form.getTextField('groom_age')
        const groom_birthplace = form.getTextField('groom_birthplace')
        const groom_residence = form.getTextField('groom_residence')
        const groom_father = form.getTextField('groom_father')
        const groom_mother = form.getTextField('groom_mother')

        const bride_age = form.getTextField('bride_age')
        const bride_birthplace = form.getTextField('bride_birthplace')
        const bride_residence = form.getTextField('bride_residence')
        const bride_father = form.getTextField('bride_father')
        const bride_mother = form.getTextField('bride_mother')

        const date_posting = form.getTextField('date_posting')
        const civil_registrar = form.getTextField('civil_registrar')
        const position = form.getTextField('position')
        const copy_furnished1 = form.getTextField('copy_furnished1')
        const copy_furnished2 = form.getTextField('copy_furnished2')
        const copy_furnished3 = form.getTextField('copy_furnished3')

        // Set field values
        // left_icon.setImage('')
        // right_icon.setImage('')

        province.setText('Province of Pangasinan')
        municipality.setText('MUNICIPALITY OF BAYAMBANG')


        groom_name.setText('')
        bride_name.setText('')

        // groom_picture.setImage('')
        // bride_picture.setImage('')

        groom_age.setText('')
        groom_birthplace.setText('')
        groom_residence.setText('')
        groom_father.setText('')
        groom_mother.setText('')

        bride_age.setText('')
        bride_birthplace.setText('')
        bride_residence.setText('')
        bride_father.setText('')
        bride_mother.setText('')

        date_posting.setText('')
        civil_registrar.setText('')
        position.setText('')

        copy_furnished1.setText('')
        copy_furnished2.setText('')
        copy_furnished3.setText('')

        // Save modified PDF
        const pdfBytes = await pdfDoc.save()

        // Optionally write to a file
        fs.writeFileSync('path_to_save.pdf', pdfBytes)

    } catch (error) {
        console.log(error)
    }
}

export { generate_marriage_notice }
