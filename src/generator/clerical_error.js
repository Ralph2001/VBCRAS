

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");


export async function generate(formData) {

    const date_now = new Date()
    const number = formData.type + '-' + formData.petition_number + '-' + date_now.getFullYear()
    const doctype = formData.type


    const content = fs.readFileSync(
        path.resolve(__dirname, '../../src/generator/documents/Live Birth/Main.docx'),
        "binary"
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });


    const petitioner_name = formData.petitioner_name
    const petitioner_number = number
    const petitioner_address = formData.barangay + ', ' + formData.city + ', ' + formData.province
    doc.render({
        petition_number: petitioner_number,
        petitioner_name: formData.petitioner_name,
        nationality: formData.nationality,
        petitioner_address: petitioner_address,
        name_owner: formData.name_owner,
        relation_owner: formData.relation_owner,
        date_of_birth: formData.date_of_birth,
        at_city: formData.at_city,
        registry_number: formData.registry_number,
        reason: formData.reason,
        LCRO_city: formData.LCRO_city,
        LCRO_province: formData.LCRO_province,

        day_ss: '',
        monthyear_ss: '',
        place_ss: formData.SwornCity,
        Ctc: formData.Ctc,
        CtcIssuedAt: formData.CtcIssuedAt,
        CtcIssuedOn: formData.CtcIssuedOn,
        administering_officer: formData.administering_officer,
        administering_position: formData.administering_position,
        decision: formData.decision,
        ActionDate: formData.ActionDate,
        mcr: formData.mcr,
        or_number: formData.or_number,
        DatePaid: formData.DatePaid

    });


    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    var folderCreation = path.resolve(__dirname, `../../output/${date_now.getFullYear() + ' ' + doctype + ' ' + petitioner_name}/`);

    if (!fs.existsSync(folderCreation)) {
        fs.mkdirSync(folderCreation, { recursive: true });
    }

    fs.writeFileSync(path.resolve(__dirname, `../../output/${date_now.getFullYear() + ' ' + doctype + ' ' + petitioner_name}/${petitioner_name}.docx`), buf);
}

