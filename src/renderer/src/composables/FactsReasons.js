

export function factReason(data) {

    const male = [
        'Boyfriend',
        'Husband',
        'Father',
        'Son',
        'Brother',
        'Uncle',
        'Nephew',
        'Grandfather',
        'Grandson'
    ]

    const female = [
        'Girlfriend',
        'Wife',
        'Partner',
        'Mother',
        'Daughter',
        'Sister',
        'Aunt',
        'Niece',
        'Grandmother',
        'Granddaughter'
    ]

    if ((data.value.cce_in !== "" && data.value.type === "CCE" && data.value.document_type === "Birth") || data.value.document_type === "Marriage") {
        const name = data.value.relation_owner
            ? `${"my " + data.value.relation_owner.toLowerCase() + "’s"}`
            : "(relation of owner)";

        const relation = name;
        const owner = data.value.relation_owner === "N/A" ? "my" : `${relation}`;
        const certificate = data.value.document_type === "Birth" ? "Live Birth" : "Marriage";


        let pronouns = 'his/her'

        male.includes(data.value.relation_owner) && data.value.cce_in === 'the' ? pronouns = 'his' :
            data.value.document_type === 'Birth' && data.value.cce_in === 'my' ? pronouns = 'my' :
                data.value.document_type === 'Marriage' && data.value.cce_in === 'my' ? pronouns = 'our' :
                    female.includes(data.value.relation_owner) && data.value.cce_in === 'the' ? pronouns = 'her' :
                        pronouns = 'his/her'

        return `To correct the above mentioned clerical error in ${owner} Certificate of ${certificate} which is inconsistent with all of ${pronouns} documents.`;
    } else if (data.value.document_type === "Death") {
        const relation = data.value.relation_owner
            ? `${"my " + data.value.relation_owner.toLowerCase() + "’s"}`
            : "unknown";
        const owner = relation || "specify";
        let pronouns = 'his/her'

        if (male.includes(data.value.relation_owner) && data.value.cce_in === 'the') {
            pronouns = 'his'
        }
        else if (female.includes(data.value.relation_owner) && data.value.cce_in === 'the') {
            pronouns = 'her'
        }

        return `To correct the above mentioned clerical error in ${owner} Certificate of Death which is inconsistent with all of ${pronouns} documents. `;
    } else {
        return `To correct the `;
    }
}