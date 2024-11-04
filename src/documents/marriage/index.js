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
    MARRIAGE_LICENSE: path
        .resolve(
            __dirname,
            '../../resources/documents/Marriage License/Application.pdf'
        )
        .replace('app.asar', 'app.asar.unpacked')
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

        const font = await pdfDoc.embedStandardFont(
            StandardFonts.TimesRomanBold
        )
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

async function generate_marriage_license() {
    try {
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE])

        // Load PDF content without 'binary' encoding
        const content = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE
        )
        const pdfDoc = await PDFDocument.load(content)
        const form = pdfDoc.getForm()

        /**
         * Get All Input Fields
         */

        const header_province = form.getTextField('header_province')
        const header_municipality = form.getTextField('header_municipality')
        const registry_number = form.getTextField('registry_number')
        const received_by = form.getTextField('received_by')
        const date_of_receipt = form.getTextField('date_of_receipt')
        const marriage_license_number = form.getTextField(
            'marriage_license_number'
        )
        const date_issuance_marriage_license = form.getTextField(
            'date_issuance_marriage_license'
        )
        const groom_contract_marriage_with = form.getTextField(
            'groom_contract_marriage_with'
        )
        const bride_contract_marriage_with = form.getTextField(
            'bride_contract_marriage_with'
        )
        const civil_registrar = form.getTextField('civil_registrar')
        const groom_first_name = form.getTextField('groom_first_name')
        const groom_middle_name = form.getTextField('groom_middle_name')
        const groom_last_name = form.getTextField('groom_last_name')
        const groom_day = form.getTextField('groom_day')
        const groom_month = form.getTextField('groom_month')
        const groom_year = form.getTextField('groom_year')
        const groom_age = form.getTextField('groom_age')
        const groom_municipality = form.getTextField('groom_municipality')
        const groom_province = form.getTextField('groom_province')
        const groom_country = form.getTextField('groom_country')
        const groom_sex = form.getTextField('groom_sex')
        const groom_citizenship = form.getTextField('groom_citizenship')
        const groom_residence = form.getTextField('groom_residence')
        const groom_residence_country = form.getTextField(
            'groom_residence_country'
        )
        const groom_religion = form.getTextField('groom_religion')
        const groom_civil_status = form.getTextField('groom_civil_status')
        const groom_previously_married_dissolved = form.getTextField(
            'groom_previously_married_dissolved'
        )
        const groom_place_dissolved = form.getTextField('groom_place_dissolved')
        const groom_date_dissolved = form.getTextField('groom_date_dissolved')
        const groom_degree_relation = form.getTextField('groom_degree_relation')
        const groom_father_first_name = form.getTextField(
            'groom_father_first_name'
        )
        const groom_father_middle_name = form.getTextField(
            'groom_father_middle_name'
        )
        const groom_father_last_name = form.getTextField(
            'groom_father_last_name'
        )
        const groom_father_citizenship = form.getTextField(
            'groom_father_citizenship'
        )
        const groom_father_residence = form.getTextField(
            'groom_father_residence'
        )
        const groom_father_residence_country = form.getTextField(
            'groom_father_residence_country'
        )
        const groom_mother_first_name = form.getTextField(
            'groom_mother_first_name'
        )
        const groom_mother_middle_name = form.getTextField(
            'groom_mother_middle_name'
        )
        const groom_mother_last_name = form.getTextField(
            'groom_mother_last_name'
        )
        const groom_mother_citizenship = form.getTextField(
            'groom_mother_citizenship'
        )
        const groom_mother_residence = form.getTextField(
            'groom_mother_residence'
        )
        const groom_mother_residence_country = form.getTextField(
            'groom_mother_residence_residence'
        )
        const groom_person_who_gave_consent = form.getTextField(
            'groom_person_who_gave_consent'
        )
        const groom_person_who_gave_consent_relation = form.getTextField(
            'groom_person_who_gave_consent_relation'
        )
        const groom_person_who_gave_consent_citizenship = form.getTextField(
            'groom_person_who_gave_consent_citizenship'
        )
        const groom_person_who_gave_consent_residence = form.getTextField(
            'groom_person_who_gave_consent_residence'
        )
        const groom_person_who_gave_consent_residence_country =
            form.getTextField('groom_person_who_gave_consent_residence_country')
    
        const groom_ss_day = form.getTextField('groom_ss_day')
        const groom_ss_month = form.getTextField('groom_ss_month')
        const groom_ss_year = form.getTextField('groom_ss_year')
        const groom_ss_at = form.getTextField('groom_ss_at')
        const groom_ctc_number = form.getTextField('groom_ctc_number')
        const groom_ctc_on = form.getTextField('groom_ctc_on')
        const groom_ctc_at = form.getTextField('groom_ctc_at')
        const bride_first_name = form.getTextField('bride_first_name')
        const bride_middle_name = form.getTextField('bride_middle_name')
        const bride_last_name = form.getTextField('bride_last_name')
        const bride_day = form.getTextField('bride_day')
        const bride_month = form.getTextField('bride_month')
        const bride_year = form.getTextField('bride_year')
        const bride_age = form.getTextField('bride_age')
        const bride_municipality = form.getTextField('bride_municipality')
        const bride_province = form.getTextField('bride_province')
        const bride_country = form.getTextField('bride_country')
        const bride_sex = form.getTextField('bride_sex')
        const bride_citizenship = form.getTextField('bride_citizenship')
        const bride_residence = form.getTextField('bride_residence')
        const bride_residence_country = form.getTextField(
            'bride_residence_country'
        )
        const bride_religion = form.getTextField('bride_religion')
        const bride_civil_status = form.getTextField('bride_civil_status')
        const bride_previously_married_dissolved = form.getTextField(
            'bride_previously_married_dissolved'
        )
        const bride_place_dissolved = form.getTextField('bride_place_dissolved')
        const bride_date_dissolved = form.getTextField('bride_date_dissolved')
        const bride_degree_relation = form.getTextField('bride_degree_relation')
        const bride_father_first_name = form.getTextField(
            'bride_father_first_name'
        )
        const bride_father_middle_name = form.getTextField(
            'bride_father_middle_name'
        )
        const bride_father_last_name = form.getTextField(
            'bride_father_last_name'
        )
        const bride_father_citizenship = form.getTextField(
            'bride_father_citizenship'
        )
        const bride_father_residence = form.getTextField(
            'bride_father_residence'
        )
        const bride_father_residence_country = form.getTextField(
            'bride_father_residence_country'
        )
        const bride_mother_first_name = form.getTextField(
            'bride_mother_first_name'
        )
        const bride_mother_middle_name = form.getTextField(
            'bride_mother_middle_name'
        )
        const bride_mother_last_name = form.getTextField(
            'bride_mother_last_name'
        )
        const bride_mother_citizenship = form.getTextField(
            'bride_mother_citizenship'
        )
        const bride_mother_residence = form.getTextField(
            'bride_mother_residence'
        )
        const bride_mother_residence_country = form.getTextField(
            'bride_mother_residence_country'
        )
        const bride_person_who_gave_consent = form.getTextField(
            'bride_person_who_gave_consent'
        )
        const bride_person_who_gave_consent_relation = form.getTextField(
            'bride_person_who_gave_consent_relation'
        )
        const bride_person_who_gave_consent_citizenship = form.getTextField(
            'bride_person_who_gave_consent_citizenship'
        )
        const bride_person_who_gave_consent_residence = form.getTextField(
            'bride_person_who_gave_consent_residence'
        )
        const bride_person_who_gave_consent_residence_country =
            form.getTextField('bride_person_who_gave_consent_residence_country')
    
        const bride_ss_day = form.getTextField('bride_ss_day')
        const bride_ss_month = form.getTextField('bride_ss_month')
        const bride_ss_year = form.getTextField('bride_ss_year')
        const bride_ss_at = form.getTextField('bride_ss_at')
        const bride_ctc_number = form.getTextField('bride_ctc_number')
        const bride_ctc_on = form.getTextField('bride_ctc_on')
        const bride_ctc_at = form.getTextField('bride_ctc_at')

        /**
         *  Setting Values
         */

        header_province.setText('Example')
        header_municipality.setText('Example')
        registry_number.setText('Example')
        received_by.setText('Example')
        date_of_receipt.setText('Example')
        marriage_license_number.setText('Example')
        date_issuance_marriage_license.setText('Example')
        groom_contract_marriage_with.setText('Example')
        bride_contract_marriage_with.setText('Example')
        civil_registrar.setText('Example')
        groom_first_name.setText('Example')
        groom_middle_name.setText('Example')
        groom_last_name.setText('Example')
        groom_day.setText('Example')
        groom_month.setText('Example')
        groom_year.setText('Example')
        groom_age.setText('Example')
        groom_municipality.setText('Example')
        groom_province.setText('Example')
        groom_country.setText('Example')
        groom_sex.setText('Example')
        groom_citizenship.setText('Example')
        groom_residence.setText('Example')
        groom_residence_country.setText('Example')
        groom_religion.setText('Example')
        groom_civil_status.setText('Example')
        groom_previously_married_dissolved.setText('Example')
        groom_place_dissolved.setText('Example')
        groom_date_dissolved.setText('Example')
        groom_degree_relation.setText('Example')
        groom_father_first_name.setText('Example')
        groom_father_middle_name.setText('Example')
        groom_father_last_name.setText('Example')
        groom_father_citizenship.setText('Example')
        groom_father_residence.setText('Example')
        groom_father_residence_country.setText('Example')
        groom_mother_first_name.setText('Example')
        groom_mother_middle_name.setText('Example')
        groom_mother_last_name.setText('Example')
        groom_mother_citizenship.setText('Example')
        groom_mother_residence.setText('Example')
        groom_mother_residence_country.setText('Example')
        groom_person_who_gave_consent.setText('Example')
        groom_person_who_gave_consent_relation.setText('Example')
        groom_person_who_gave_consent_citizenship.setText('Example')
        groom_person_who_gave_consent_residence.setText('Example')
        groom_person_who_gave_consent_residence_country.setText('Example')
     
        groom_ss_day.setText('Example')
        groom_ss_month.setText('Example')
        groom_ss_year.setText('Example')
        groom_ss_at.setText('Example')
        groom_ctc_number.setText('Example')
        groom_ctc_on.setText('Example')
        groom_ctc_at.setText('Example')
        bride_first_name.setText('Example')
        bride_middle_name.setText('Example')
        bride_last_name.setText('Example')
        bride_day.setText('Example')
        bride_month.setText('Example')
        bride_year.setText('Example')
        bride_age.setText('Example')
        bride_municipality.setText('Example')
        bride_province.setText('Example')
        bride_country.setText('Example')
        bride_sex.setText('Example')
        bride_citizenship.setText('Example')
        bride_residence.setText('Example')
        bride_residence_country.setText('Example')
        bride_religion.setText('Example')
        bride_civil_status.setText('Example')
        bride_previously_married_dissolved.setText('Example')
        bride_place_dissolved.setText('Example')
        bride_date_dissolved.setText('Example')
        bride_degree_relation.setText('Example')
        bride_father_first_name.setText('Example')
        bride_father_middle_name.setText('Example')
        bride_father_last_name.setText('Example')
        bride_father_citizenship.setText('Example')
        bride_father_residence.setText('Example')
        bride_father_residence_country.setText('Example')
        bride_mother_first_name.setText('Example')
        bride_mother_middle_name.setText('Example')
        bride_mother_last_name.setText('Example')
        bride_mother_citizenship.setText('Example')
        bride_mother_residence.setText('Example')
        bride_mother_residence_country.setText('Example')
        bride_person_who_gave_consent.setText('Example')
        bride_person_who_gave_consent_relation.setText('Example')
        bride_person_who_gave_consent_citizenship.setText('Example')
        bride_person_who_gave_consent_residence.setText('Example')
        bride_person_who_gave_consent_residence_country.setText('Example')
      
        bride_ss_day.setText('Example')
        bride_ss_month.setText('Example')
        bride_ss_year.setText('Example')
        bride_ss_at.setText('Example')
        bride_ctc_number.setText('Example')
        bride_ctc_on.setText('Example')
        bride_ctc_at.setText('Example')

        // Save  PDF
        const pdfBytes = await pdfDoc.save()

        // Optionally write to a file
        fs.writeFileSync('path_to_save_marriage.pdf', pdfBytes)

    } catch (error) {
        console.log(error)
    }
}

export { generate_marriage_notice, generate_marriage_license }
