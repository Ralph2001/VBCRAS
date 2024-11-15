import { exec } from 'child_process'
import { PageSizes, PDFDocument, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';
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
            '../../resources/documents/Marriage License/Marriage License Base.pdf'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    MARRIAGE_LICENSE_PRINT: path
        .resolve(
            __dirname,
            '../../resources/documents/Marriage License/Marriage License Print.pdf'
        )
        .replace('app.asar', 'app.asar.unpacked'),
    LEFT_ICON: path
        .resolve(__dirname, '../../resources/images/left_icon.png')
        .replace('app.asar', 'app.asar.unpacked'),
    RIGHT_ICON: path
        .resolve(__dirname, '../../resources/images/right_icon.png')
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

function base64ToUint8Array(base64) {
    const base64Data = base64.replace(/^data:image\/png;base64,/, '') // Clean Base64 prefix
    const binaryString = atob(base64Data) // Decode Base64 string into binary string
    const uint8Array = new Uint8Array(binaryString.length) // Create a Uint8Array of the correct length

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i) // Fill the array with binary data
    }

    return uint8Array // Return the Uint8Array
}

const embedImageIfValid = async (pdfDoc, imageBase64) => {
    // Check if the base64 string is valid
    if (imageBase64 && imageBase64 !== 'null' && imageBase64 !== '') {
        try {
            // Convert base64 to Uint8Array
            const imageUnit8 = base64ToUint8Array(imageBase64);

            // Embed the image into the PDF
            const embeddedImage = await pdfDoc.embedPng(imageUnit8);
            return embeddedImage;
        } catch (error) {
            console.error('Error embedding image:', error);
            return null;
        }
    } else {
        console.error('Invalid image data');
        return null;
    }
};


async function generate_marriage_notice(formData, image) {
    try {

        const ArialFontBytes = fs.readFileSync(path
            .resolve(
                __dirname,
                '../../resources/images/fonts/Arial.TTF'
            )
            .replace('app.asar', 'app.asar.unpacked'),)
        const ArialItalicFontBytes = fs.readFileSync(path
            .resolve(
                __dirname,
                '../../resources/images/fonts/Arial Italic.TTF'
            )
            .replace('app.asar', 'app.asar.unpacked'),)
        const ArialBoldFontBytes = fs.readFileSync(path
            .resolve(
                __dirname,
                '../../resources/images/fonts/Arial Bold.TTF'
            )
            .replace('app.asar', 'app.asar.unpacked'),)

        // Ensure file exists before proceeding
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.NOTICE])

        // Load PDF content without 'binary' encoding
        const content = fs.readFileSync(MARRIAGE_TEMPLATE_PATHS.NOTICE)
        const pdfDoc = await PDFDocument.load(content)
        pdfDoc.registerFontkit(fontkit);

        const ArialFont = await pdfDoc.embedFont(ArialFontBytes);
        const ArialItalicFont = await pdfDoc.embedFont(ArialItalicFontBytes);
        const ArialBoldFont = await pdfDoc.embedFont(ArialBoldFontBytes);
        const form = pdfDoc.getForm()

        /**
         *  Data
         * @data
         */

        const data = JSON.parse(formData)
        const images = JSON.parse(image)

        // Retrieve form fields
        // const left_icon = form.getButton('left_icon')
        // const right_icon = form.getButton('right_icon')

        const province = form.getTextField('province')
        const municipality = form.getTextField('municipality')

        const font = await pdfDoc.embedStandardFont(
            StandardFonts.TimesRomanBold
        )
        const office = form.getTextField('office')


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

        const left_icon_bytes = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.LEFT_ICON
        )
        const right_icon_bytes = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.RIGHT_ICON
        )

        const leftIcon = await pdfDoc.embedPng(left_icon_bytes)
        const rightIcon = await pdfDoc.embedPng(right_icon_bytes)


        const [bridePicture, groomPicture] = await Promise.all([
            embedImageIfValid(pdfDoc, images[0]),
            embedImageIfValid(pdfDoc, images[1])
        ]);

        if (!bridePicture) {
            console.log('Error: Bride picture could not be embedded');
        }
        if (!groomPicture) {
            console.log('Error: Groom picture could not be embedded');
        }

        // Define fixed size for icons (e.g., 100x100 points)
        const iconWidth = 100 // Width of the icon in points
        const iconHeight = 100 // Height of the icon in points

        // Define some space above and below the logos
        const topMargin = 35 // Space from the top of the page
        const iconSpacing = 250 // Space between the two logos
        const pageWidth = 612 // Page width (8.5 inches in points)
        const centerX = pageWidth / 2 // Center of the page horizontally

        // Calculate positions for the icons
        const leftIconX = centerX - iconWidth - iconSpacing / 2 // Left position
        const rightIconX = centerX + iconSpacing / 2 // Right position
        const iconY = 936 - topMargin - iconHeight // Y position from the top margin

        const page = pdfDoc.getPages()[0]

        // Draw the left icon with rotation and fixed size
        page.drawImage(leftIcon, {
            x: leftIconX,
            y: iconY,
            width: iconWidth + 10,
            height: iconHeight + 10
        })

        // Draw the right icon with rotation and fixed size
        page.drawImage(rightIcon, {
            x: rightIconX,
            y: iconY,
            width: iconWidth,
            height: iconHeight
        })

        office.setText('LOCAL CIVIL REGISTRY') //
        office.updateAppearances(font)

        province.setText('Province of Pangasinan') //
        municipality.setText('MUNICIPALITY OF BAYAMBANG')
        municipality.updateAppearances(font)

        groom_name.setText(data.notice_groom_name)
        bride_name.setText(data.notice_bride_name)


        if (bridePicture) {
            bride_picture.setImage(bridePicture);
        } else {
            console.log('No valid bride picture to embed');
        }

        if (groomPicture) {
            groom_picture.setImage(groomPicture);
        } else {
            console.log('No valid groom picture to embed');
        }




        groom_age.setText(data.notice_groom_age)
        groom_age.updateAppearances(ArialFont)
        groom_birthplace.setText(data.notice_groom_birthplace)
        groom_birthplace.updateAppearances(ArialFont)
        groom_residence.setText(data.notice_groom_residence)
        groom_residence.updateAppearances(ArialFont)
        groom_father.setText(data.notice_groom_father)
        groom_father.updateAppearances(ArialFont)
        groom_mother.setText(data.notice_groom_mother)
        groom_mother.updateAppearances(ArialFont)

        bride_age.setText(data.notice_bride_age)
        bride_age.updateAppearances(ArialFont)
        bride_birthplace.setText(data.notice_bride_birthplace)
        bride_birthplace.updateAppearances(ArialFont)
        bride_residence.setText(data.notice_bride_residence)
        bride_residence.updateAppearances(ArialFont)
        bride_father.setText(data.notice_bride_father)
        bride_father.updateAppearances(ArialFont)
        bride_mother.setText(data.notice_bride_mother)
        bride_mother.updateAppearances(ArialFont)

        date_posting.setText(data.notice_date_posting)
        date_posting.updateAppearances(ArialFont)
        civil_registrar.setText(data.civil_registrar)
        civil_registrar.updateAppearances(ArialBoldFont)

        position.setText('Municipal Civil Registrar')
        position.updateAppearances(ArialItalicFont)


        copy_furnished1.setText(data.notice_copy_furnished1)
        copy_furnished1.updateAppearances(ArialFont)
        copy_furnished2.setText(data.notice_copy_furnished2)
        copy_furnished2.updateAppearances(ArialFont)
        copy_furnished3.setText(data.notice_copy_furnished3)
        copy_furnished3.updateAppearances(ArialFont)

        form.flatten();

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })
        return { status: true, pdfbase64: pdfBytes }
    } catch (error) {
        console.log(error)
    }
}

async function generate_marriage_license(formData) {
    try {
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE])

        const content = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE
        )
        const pdfDoc = await PDFDocument.load(content)
        const form = pdfDoc.getForm()

        // Embed Helvetica font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        /**
         *  Data
         * @data
         */

        const data = JSON.parse(formData)

        const fields = [
            'header_province',
            'header_municipality',
            'registry_number',
            'received_by',
            'date_of_receipt',
            'marriage_license_number',
            'date_issuance_marriage_license',
            'groom_contract_marriage_with',
            'bride_contract_marriage_with',
            'civil_registrar',
            'groom_first_name',
            'groom_middle_name',
            'groom_last_name',
            'groom_day',
            'groom_month',
            'groom_year',
            'groom_age',
            'groom_municipality',
            'groom_province',
            'groom_country',
            'groom_sex',
            'groom_citizenship',
            'groom_residence',

            'groom_religion',
            'groom_civil_status',
            'groom_previously_married_dissolved',
            'groom_place_dissolved',
            'groom_date_dissolved',
            'groom_degree_relation',
            'groom_father_first_name',
            'groom_father_middle_name',
            'groom_father_last_name',
            'groom_father_citizenship',
            'groom_father_residence',

            'groom_mother_first_name',
            'groom_mother_middle_name',
            'groom_mother_last_name',
            'groom_mother_citizenship',
            'groom_mother_residence',

            'groom_person_who_gave_consent',
            'groom_person_who_gave_consent_relation',
            'groom_person_who_gave_consent_citizenship',
            'groom_person_who_gave_consent_residence',

            'groom_ss_day',
            'groom_ss_month',
            'groom_ss_year',
            'groom_ss_at',
            'groom_ctc_number',
            'groom_ctc_on',
            'groom_ctc_at',
            'bride_first_name',
            'bride_middle_name',
            'bride_last_name',
            'bride_day',
            'bride_month',
            'bride_year',
            'bride_age',
            'bride_municipality',
            'bride_province',
            'bride_country',
            'bride_sex',
            'bride_citizenship',
            'bride_residence',

            'bride_religion',
            'bride_civil_status',
            'bride_previously_married_dissolved',
            'bride_place_dissolved',
            'bride_date_dissolved',
            'bride_degree_relation',
            'bride_father_first_name',
            'bride_father_middle_name',
            'bride_father_last_name',
            'bride_father_citizenship',
            'bride_father_residence',

            'bride_mother_first_name',
            'bride_mother_middle_name',
            'bride_mother_last_name',
            'bride_mother_citizenship',
            'bride_mother_residence',

            'bride_person_who_gave_consent',
            'bride_person_who_gave_consent_relation',
            'bride_person_who_gave_consent_citizenship',
            'bride_person_who_gave_consent_residence',

            'bride_ss_day',
            'bride_ss_month',
            'bride_ss_year',
            'bride_ss_at',
            'bride_ctc_number',
            'bride_ctc_on',
            'bride_ctc_at'
        ]

        // Set values for each field
        fields.forEach((fieldName) => {
            const field = form.getTextField(fieldName)
            const fieldValue = data[fieldName] || ''

            const fontSize = 9
            field.setText(fieldValue)
            field.updateAppearances(helveticaFont)
            // field.setFontSize(fontSize); Update Font???
        })

        form.flatten()

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })

        return { status: true, pdfbase64: pdfBytes }
    } catch (error) {
        console.log(error)
    }
}

// print_decided_license
async function print_decided_license(formData, params) {
    try {
        // Check if the required template exists
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE_PRINT])

        const content = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE_PRINT
        )
        const pdfDoc = await PDFDocument.load(content)
        const form = pdfDoc.getForm()

        // Embed Helvetica font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const data = JSON.parse(formData)
        const adjustments = JSON.parse(params)

        // List of form fields to update
        const fields = [
            'header_province',
            'header_municipality',
            'registry_number',
            'received_by',
            'date_of_receipt',
            'marriage_license_number',
            'date_issuance_marriage_license',
            'groom_contract_marriage_with',
            'bride_contract_marriage_with',
            'civil_registrar',
            'groom_first_name',
            'groom_middle_name',
            'groom_last_name',
            'groom_day',
            'groom_month',
            'groom_year',
            'groom_age',
            'groom_municipality',
            'groom_province',
            'groom_country',
            'groom_sex',
            'groom_citizenship',
            'groom_residence',
            'groom_religion',
            'groom_civil_status',
            'groom_previously_married_dissolved',
            'groom_place_dissolved',
            'groom_date_dissolved',
            'groom_degree_relation',
            'groom_father_first_name',
            'groom_father_middle_name',
            'groom_father_last_name',
            'groom_father_citizenship',
            'groom_father_residence',
            'groom_mother_first_name',
            'groom_mother_middle_name',
            'groom_mother_last_name',
            'groom_mother_citizenship',
            'groom_mother_residence',
            'groom_person_who_gave_consent',
            'groom_person_who_gave_consent_relation',
            'groom_person_who_gave_consent_citizenship',
            'groom_person_who_gave_consent_residence',
            'groom_ss_day',
            'groom_ss_month',
            'groom_ss_year',
            'groom_ss_at',
            'groom_ctc_number',
            'groom_ctc_on',
            'groom_ctc_at',
            'bride_first_name',
            'bride_middle_name',
            'bride_last_name',
            'bride_day',
            'bride_month',
            'bride_year',
            'bride_age',
            'bride_municipality',
            'bride_province',
            'bride_country',
            'bride_sex',
            'bride_citizenship',
            'bride_residence',
            'bride_religion',
            'bride_civil_status',
            'bride_previously_married_dissolved',
            'bride_place_dissolved',
            'bride_date_dissolved',
            'bride_degree_relation',
            'bride_father_first_name',
            'bride_father_middle_name',
            'bride_father_last_name',
            'bride_father_citizenship',
            'bride_father_residence',
            'bride_mother_first_name',
            'bride_mother_middle_name',
            'bride_mother_last_name',
            'bride_mother_citizenship',
            'bride_mother_residence',
            'bride_person_who_gave_consent',
            'bride_person_who_gave_consent_relation',
            'bride_person_who_gave_consent_citizenship',
            'bride_person_who_gave_consent_residence',
            'bride_ss_day',
            'bride_ss_month',
            'bride_ss_year',
            'bride_ss_at',
            'bride_ctc_number',
            'bride_ctc_on',
            'bride_ctc_at'
        ]

        // Set values for each field
        fields.forEach((fieldName) => {
            const field = form.getTextField(fieldName)
            const fieldValue = data[fieldName] || ''
            // const fontSize = 9;
            field.setText(fieldValue)
            // field.updateAppearances(helveticaFont);
        })

        form.flatten()

        // Form to be copied
        const pdfBytes = await pdfDoc.save()

        // Create a new PDF document
        const newPdfDoc = await PDFDocument.create()

        // Load the original PDF document (note: pdfBytes is in a buffer format here)
        const originalPdfDoc = await PDFDocument.load(pdfBytes)

        // Ensure we're copying a valid page (copy the first page)
        const pages = await originalPdfDoc.copyPages(originalPdfDoc, [0])

        if (!pages || !pages[0]) {
            throw new Error('Failed to copy the page correctly.')
        }

        const firstDonorPage = pages[0]

        // Get the original page size
        const originalPageWidth = firstDonorPage.getWidth()
        const originalPageHeight = firstDonorPage.getHeight()

        // Add a new page with the same size as the original
        const newPage = newPdfDoc.addPage([
            originalPageWidth,
            originalPageHeight
        ])

        // Embed the copied page onto the new page
        const embeddedPage = await newPdfDoc.embedPage(firstDonorPage)

        // Optional: Adjust positioning with given x and y offsets
        const x_axis_adjustments = !isNaN(Number(adjustments.x))
            ? Number(adjustments.x)
            : 0
        const y_axis_adjustments = !isNaN(Number(adjustments.y))
            ? Number(adjustments.y)
            : 0

        newPage.drawPage(embeddedPage, {
            x: 12,
            y: -27
        })

        // Save the new PDF
        const pdfBytesToBePrinted = await newPdfDoc.saveAsBase64()

        return { status: true, pdfbase64: pdfBytesToBePrinted }
    } catch (error) {
        console.error('Error:', error)
        return { status: false, message: error.message }
    }
}

export {
    generate_marriage_notice,
    generate_marriage_license,
    print_decided_license
}
