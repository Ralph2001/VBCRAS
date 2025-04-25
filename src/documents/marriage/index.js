
import { PageSizes, PDFDocument, StandardFonts, TextAlignment } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { format } from 'date-fns'
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
            const imageUnit8 = base64ToUint8Array(imageBase64)

            // Embed the image into the PDF
            const embeddedImage = await pdfDoc.embedPng(imageUnit8)
            return embeddedImage
        } catch (error) {
            console.error('Error embedding image:', error)
            return null
        }
    } else {
        console.error('Invalid image data')
        return null
    }
}

async function generate_marriage_notice(formData, image) {
    try {
        const ArialFontBytes = fs.readFileSync(
            path
                .resolve(__dirname, '../../resources/images/fonts/Arial.TTF')
                .replace('app.asar', 'app.asar.unpacked')
        )
        const ArialItalicFontBytes = fs.readFileSync(
            path
                .resolve(
                    __dirname,
                    '../../resources/images/fonts/Arial Italic.TTF'
                )
                .replace('app.asar', 'app.asar.unpacked')
        )
        const ArialBoldFontBytes = fs.readFileSync(
            path
                .resolve(
                    __dirname,
                    '../../resources/images/fonts/Arial Bold.TTF'
                )
                .replace('app.asar', 'app.asar.unpacked')
        )

        // Ensure file exists before proceeding
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.NOTICE])

        // Load PDF content without 'binary' encoding
        const content = fs.readFileSync(MARRIAGE_TEMPLATE_PATHS.NOTICE)
        const pdfDoc = await PDFDocument.load(content)
        pdfDoc.registerFontkit(fontkit)

        const ArialFont = await pdfDoc.embedFont(ArialFontBytes)
        const ArialItalicFont = await pdfDoc.embedFont(ArialItalicFontBytes)
        const ArialBoldFont = await pdfDoc.embedFont(ArialBoldFontBytes)
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
        const copy_furnished4 = form.getTextField('copy_furnished4')

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
        ])

        if (!bridePicture) {
            console.log('Error: Bride picture could not be embedded')
        }
        if (!groomPicture) {
            console.log('Error: Groom picture could not be embedded')
        }

        // Define fixed size for icons (e.g., 100x100 points)
        const iconWidth = 95 // Width of the icon in points
        const iconHeight = 95 // Height of the icon in points

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

        office.setText('LOCAL CIVIL REGISTRY OFFICE') //
        office.updateAppearances(font)

        province.setText('Province of Pangasinan') //
        municipality.setText('MUNICIPALITY OF BAYAMBANG')
        municipality.updateAppearances(font)

        groom_name.setText(data.notice_groom_name)
        bride_name.setText(data.notice_bride_name)

        if (bridePicture) {
            bride_picture.setImage(bridePicture)
        } else {
            console.log('No valid bride picture to embed')
        }

        if (groomPicture) {
            groom_picture.setImage(groomPicture)
        } else {
            console.log('No valid groom picture to embed')
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

        const parsedDate = new Date(data.notice_date_posting);
        date_posting.setText(format(parsedDate, 'MMMM dd, yyyy'))
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
        copy_furnished4.setText(data.notice_copy_furnished4)
        copy_furnished4.updateAppearances(ArialFont)

        form.flatten()

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })
        return { status: true, pdfbase64: pdfBytes }
    } catch (error) {
        console.log(error)
    }
}


async function generate_marriage_license(formData) {
    try {
        // Check if the necessary files exist
        checkFilesExist([MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE])

        // Load the PDF template
        const content = fs.readFileSync(
            MARRIAGE_TEMPLATE_PATHS.MARRIAGE_LICENSE
        )
        const pdfDoc = await PDFDocument.load(content)
        const form = pdfDoc.getForm()

        // Embed the Helvetica font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Parse the form data
        const data = JSON.parse(formData)


        const updateBirthDateField = (birthDate, prefix) => {
            // Add validation
            if (!birthDate || isNaN(new Date(birthDate).getTime())) {
                console.error(`Invalid date for ${prefix}:`, birthDate);
                return;
            }

            // Parse date using ISO format
            const parsedDate = new Date(birthDate);

            // Validate parsed date
            if (isNaN(parsedDate.getTime())) {
                console.error(`Failed to parse date for ${prefix}:`, birthDate);
                return;
            }

            const dayField = form.getTextField(`${prefix}_day`);
            const monthField = form.getTextField(`${prefix}_month`);
            const yearField = form.getTextField(`${prefix}_year`);

            try {
                dayField.setText(format(parsedDate, 'dd'));
                monthField.setText(format(parsedDate, 'MMMM').toUpperCase());
                yearField.setText(format(parsedDate, 'yyyy'));

                [dayField, monthField, yearField].forEach(field => field.updateAppearances(helveticaFont));
            } catch (error) {
                console.error(`Error formatting date for ${prefix}:`, error);
            }
        };

        // Groom
        updateBirthDateField(data.groom_date_birth, 'groom');

        // Bride
        updateBirthDateField(data.bride_date_birth, 'bride');



        const updateDateFormat = (date, prefix) => {
            // Add validation
            if (!date || isNaN(new Date(date).getTime())) {
                console.error(`Invalid date for ${prefix}:`, date);
                return;
            }

            const parsedDate = new Date(date);

            if (isNaN(parsedDate.getTime())) {
                console.error(`Failed to parse date for ${prefix}:`, date);
                return;
            }
            const dateField = form.getTextField(`${prefix}`);
            try {
                dateField.setText(format(parsedDate, 'MMMM dd, yyyy').toUpperCase());
                dateField.updateAppearances(helveticaFont)
            }
            catch (error) {
                console.error(`Error formatting date for ${prefix}:`, error);
            }

        }


        updateDateFormat(data.date_of_receipt, 'date_of_receipt')
        updateDateFormat(data.date_issuance_marriage_license, 'date_issuance_marriage_license')

        // Helper function to add ordinal suffix
        const getOrdinalSuffix = (day) => {
            const j = day % 10,
                k = day % 100;
            if (j === 1 && k !== 11) return 'ST';
            if (j === 2 && k !== 12) return 'ND';
            if (j === 3 && k !== 13) return 'RD';
            return 'TH';
        };

        const updateSSDateField = (date, prefix) => {
            if (!date || isNaN(new Date(date).getTime())) {
                console.error(`Invalid date for ${prefix}:`, date);
                return;
            }

            const parsedDate = new Date(date);

            if (isNaN(parsedDate.getTime())) {
                console.error(`Failed to parse date for ${prefix}:`, date);
                return;
            }

            const dayField = form.getTextField(`${prefix}_ss_day`);
            const monthField = form.getTextField(`${prefix}_ss_month`);
            const yearField = form.getTextField(`${prefix}_ss_year`);

            try {
                const day = parsedDate.getDate();
                const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

                dayField.setText(dayWithSuffix);
                monthField.setText(format(parsedDate, 'MMMM').toUpperCase());
                yearField.setText(format(parsedDate, 'yyyy'));

                [dayField, monthField, yearField].forEach(field => field.updateAppearances(helveticaFont));
            } catch (error) {
                console.error(`Error formatting date for ${prefix}:`, error);
            }
        };



        // Subscribe and Sworn

        updateSSDateField(data.date_of_receipt, 'groom')
        updateSSDateField(data.date_of_receipt, 'bride')


        const updateCTCDate = (date, prefix) => {
            if (!date || isNaN(new Date(date).getTime())) {
                console.error(`Invalid date for ${prefix}:`, date);
                return;
            }
            // Parse date using ISO format
            const parsedDate = new Date(date);

            // Validate parsed date
            if (isNaN(parsedDate.getTime())) {
                console.error(`Failed to parse date for ${prefix}:`, date);
                return;
            }

            const dateField = form.getTextField(`${prefix}_ctc_on`);
            try {
                const date = format(parsedDate, 'dd MMMM yyyy').toUpperCase()
                dateField.setText(date);

                [dateField].forEach(field => field.updateAppearances(helveticaFont));
            } catch (error) {
                console.error(`Error formatting date for ${prefix}:`, error);
            }


        }

        // Community Tax Certificate

        updateCTCDate(data.groom_ctc_on, 'groom')
        updateCTCDate(data.bride_ctc_on, 'bride')


        // Define the fields in the form
        const fields = [
            'header_province',
            'header_municipality',
            'registry_number',
            'received_by',

            'marriage_license_number',
            'groom_contract_marriage_with',
            'bride_contract_marriage_with',
            'civil_registrar',
            'groom_first_name',
            'groom_middle_name',
            'groom_last_name',

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

            'groom_ss_at',
            'groom_ctc_number',

            'groom_ctc_at',
            'bride_first_name',
            'bride_middle_name',
            'bride_last_name',

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

            'bride_ss_at',
            'bride_ctc_number',

            'bride_ctc_at'
        ]

        const fields_to_avoid = [
            'groom_contract_marriage_with',
            'bride_contract_marriage_with',
            'groom_municipality',
            'groom_province',
            'groom_country',
            'groom_residence',
            'groom_father_residence',
            'groom_mother_residence',
            'groom_person_who_gave_consent',
            'groom_person_who_gave_consent_residence',

            'bride_municipality',
            'bride_province',
            'bride_country',
            'bride_residence',
            'groom_father_residence',
            'bride_mother_residence',
            'bride_person_who_gave_consent',
            'bride_person_who_gave_consent_residence',
        ]

        fields.forEach((fieldName) => {
            const field = form.getTextField(fieldName)
            const fieldValue = data[fieldName] || ''

            if (fields_to_avoid.includes(fieldName)) {
                adjustTextFieldSizeAndFit(
                    pdfDoc,
                    field,
                    fieldValue,
                    helveticaFont
                )
            } else {
                field.setText(fieldValue)
                field.updateAppearances(helveticaFont)
            }
        })

        // Flatten the form (turn fields into static text)
        form.flatten()

        // Save the PDF as base64
        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })

        return { status: true, pdfbase64: pdfBytes }
    } catch (error) {
        console.error(error)
    }
}

async function adjustTextFieldSizeAndFit(
    pdfDoc,
    field,
    fieldValue,
    helveticaFont
) {
    try {
        const acroField = field.acroField

        const widgets = acroField.getWidgets()

        // Ensure the field has widgets
        if (widgets.length === 0) {
            console.warn(
                `Field "${field.getName()}" does not have widgets. Skipping.`
            )
            return
        }

        // Get the dimensions of the field
        const { width, height } = widgets[0].getRectangle()

        let fontSize = 9
        let minFontSize = 6

        // Measure the width of the text
        const measureTextWidth = (text, fontSize) =>
            helveticaFont.widthOfTextAtSize(text, fontSize)

        // Check if the text fits within the width and height
        const doesTextFit = (text, fontSize, maxWidth, maxHeight) => {
            const textWidth = measureTextWidth(text, fontSize)
            const lines = Math.ceil(textWidth / maxWidth) // Calculate the number of lines based on width
            const textHeight = fontSize * lines // Estimate the height required
            return textWidth <= maxWidth && textHeight <= maxHeight
        }

        // Decrease the font size until the text fits
        while (
            !doesTextFit(fieldValue, fontSize, width, height) &&
            fontSize > minFontSize
        ) {
            fontSize -= 0.5
        }

        // Set the adjusted text, font size, and appearance
        field.setText(fieldValue)
        field.updateAppearances(helveticaFont)
        field.setFontSize(fontSize)
        field.enableMultiline()

        console.log(field.getName() + 'Does it Printe? ' + field.setText(fieldValue))

        if (field.getName() === 'groom_contract_marriage_with' || field.getName() === 'bride_contract_marriage_with'
        ) {
            field.setAlignment(TextAlignment.Right)
            return
        }
        // Adjust alignment based on text length (optional)
        if (fieldValue.length > 40) {
            field.setAlignment(TextAlignment.Left)
        } else {
            field.setAlignment(TextAlignment.Center)
        }
    } catch (error) {
        console.error(
            `Error adjusting text field size for "${field.getName()}":`,
            error
        )
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

        fields.forEach((fieldName) => {
            const field = form.getTextField(fieldName)
            const fieldValue = data[fieldName] || ''

            if (
                fieldName === 'groom_mother_residence' ||
                fieldName === 'bride_mother_residence'
            ) {
                if (fieldValue.length >= 40) {
                    field.setText(fieldValue)
                    field.updateAppearances(helveticaFont)
                    field.setAlignment(TextAlignment.Left)
                    field.setFontSize(7.8)
                    field.enableMultiline()
                } else {
                    field.setText(fieldValue)
                    field.updateAppearances(helveticaFont)
                    field.setAlignment(TextAlignment.Center)
                    field.setFontSize(9)
                }
            } else {
                field.setText(fieldValue)
                field.updateAppearances(helveticaFont)
            }
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
        const x_axis_adjustments = (Number(adjustments.x))
            ? Number(adjustments.x)
            : 0
        const y_axis_adjustments = (Number(adjustments.y))
            ? Number(adjustments.y)
            : 0

        newPage.drawPage(embeddedPage, {
            x: x_axis_adjustments,
            y: y_axis_adjustments
        })

        // Save the new PDF
        const pdfBytesToBePrinted = await newPdfDoc.saveAsBase64()

        return { status: true, pdfbase64: pdfBytesToBePrinted }
    } catch (error) {
        console.error('Error:', error)
        return { status: false, message: error.message }
    }
}

// Save Application of Marriage License and Notice of Posting to Fixed Folder Path
/* 
  Folder Path Structure

  ### /Groom Fist Name + Groom Last Name + & + Bride First Name + Bride Last Name/ Application for Marriage License.pdf
  ### /Groom Fist Name + Groom Last Name + & + Bride First Name + Bride Last Name/ Notice.pdf

*/
async function save_marriage_license_and_notice(formData, image) {
    try {
        // Parse the form data and image paths
        const data = JSON.parse(formData);
        const images = JSON.parse(image);

        if (!data || !images) {
            throw new Error('Invalid formData or image data.');
        }

        if (!data.groom_first_name || !data.bride_first_name) {
            throw new Error('Both Groom and Bride names are required');
        }

        // Generate the marriage license and notice
        const marriageLicense = await generate_marriage_license(formData);
        const marriageNotice = await generate_marriage_notice(formData, image);

        if (!marriageLicense?.pdfbase64 || !marriageNotice?.pdfbase64) {
            throw new Error('Failed to generate one or both documents.');
        }

        // Decode base64 strings to binary
        const marriageLicenseBuffer = Buffer.from(marriageLicense.pdfbase64.split(',')[1], 'base64');
        const marriageNoticeBuffer = Buffer.from(marriageNotice.pdfbase64.split(',')[1], 'base64');

        const groomLastName = data.groom_last_name ? data.groom_last_name : '(nolastname)';
        const brideLastName = data.bride_last_name ? data.bride_last_name : '(nolastname)';

        // Define folder paths
        const folderName = `${data.groom_first_name} ${groomLastName} & ${data.bride_first_name} ${brideLastName}`;


        // Get current year and month for dynamic folder creation
        const currentDate = new Date();
        const year = currentDate.getFullYear();

        // Array of month names (index 0 = January, index 1 = February, ...)
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const month = monthNames[currentDate.getMonth()];

        const outputDir = path.resolve(__dirname, `../../output/${folderName}`).replace('app.asar', 'app.asar.unpacked');

        const userPicturesDir = path.resolve(
            process.env.USERPROFILE || process.env.HOME,
            'Pictures', 'Marriage Pictures', year.toString(), month, folderName
        );


        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        if (!fs.existsSync(userPicturesDir)) {
            fs.mkdirSync(userPicturesDir, { recursive: true });
        }

        // Define file paths for PDF files
        const marriageLicensePath = path.join(outputDir, 'Application for Marriage License.pdf');
        const marriageNoticePath = path.join(outputDir, 'Notice.pdf');

        // Write PDF files to the folder
        fs.writeFileSync(marriageLicensePath, marriageLicenseBuffer);
        fs.writeFileSync(marriageNoticePath, marriageNoticeBuffer);

        if (images && images.length > 0) {
            images.forEach((imagePath, index) => {
                if (!imagePath) {
                    console.log(`Skipping invalid image path at index ${index}`);
                    return; // Skip this iteration if imagePath is null or undefined
                }

                let imageFileName;

                // If the image is base64-encoded, use a fixed extension (e.g., .jpg)
                if (imagePath.startsWith('data:image')) {
                    imageFileName = `Photo-${index + 1}.jpg`; // Save as .jpg
                    const base64Data = imagePath.split(',')[1]; // Remove the "data:image/jpeg;base64," part
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    const destPath = path.join(userPicturesDir, imageFileName);
                    fs.writeFileSync(destPath, imageBuffer);
                    console.log(`Saved base64 image to ${destPath}`);
                } else {
                    // If the image is a file path, use its original extension
                    imageFileName = `Photo-${index + 1}${path.extname(imagePath)}`; // Use original extension from path
                    const destPath = path.join(userPicturesDir, imageFileName);
                    fs.copyFileSync(imagePath, destPath);
                    console.log(`Copied image from ${imagePath} to ${destPath}`);
                }
            });
        } else {
            console.log('No images provided, skipping image saving.');
        }


        console.log('Marriage license, notice, and images (if provided) saved successfully.');
        return { status: true, filepath: outputDir }

    } catch (error) {
        console.error('Error saving marriage license, notice, or images:', error.message);
    }
}


export {
    generate_marriage_notice,
    generate_marriage_license,
    print_decided_license,
    save_marriage_license_and_notice
}
