

export function factReason(data) {

    const petition_type = data.value.petition_type
    const error_in = data.value.petitioner_error_in
    const event_type = data.value.event_type
    const relation_owner = data.value.relation_owner

    const male = [
        'boyfriend',
        'husband',
        'father',
        'son',
        'brother',
        'uncle',
        'nephew',
        'grandfather',
        'grandson',
        'stepfather',
        'stepson',
        'godfather',
        'godson',
        'father-in-law',
        'son-in-law'
    ];

    const female = [
        'girlfriend',
        'wife',
        'partner',
        'mother',
        'daughter',
        'sister',
        'aunt',
        'niece',
        'grandmother',
        'granddaughter',
        'stepmother',
        'stepdaughter',
        'godmother',
        'goddaughter',
        'mother-in-law',
        'daughter-in-law'
    ];

    if (error_in !== "" && petition_type === "CCE" && event_type === "Birth" || event_type === "Marriage") {
        const name = relation_owner
            ? `${"my " + relation_owner.toLowerCase() + "’s"}`
            : "(relation of owner)";

        const relation = name;
        const owner = relation_owner === "N/A" ? "my" : `${relation}`;
        const certificate = event_type === "Birth" ? "Live Birth" : "Marriage";

        let pronouns = 'his/her'


        male.includes(relation_owner.toLowerCase()) && error_in === 'the' ? pronouns = 'his' :
            event_type === 'Birth' && error_in === 'my' ? pronouns = 'my' :
                event_type === 'Marriage' && error_in === 'my' ? pronouns = 'our' :
                    female.includes(relation_owner.toLowerCase()) && error_in === 'the' ? pronouns = 'her' :
                        pronouns = 'his/her'

        return {
            data: {
                petition_type,
                error_in,
                event_type,
                relation_owner,
                pronouns,
                owner
            },
            message: `To correct the above-mentioned clerical error in ${owner} Certificate of ${certificate} which is inconsistent with all of ${pronouns} documents.`
        }
    }
    else if (event_type === "Death") {
        const relation = relation_owner
            ? `${"my " + relation_owner.toLowerCase() + "’s"}`
            : "unknown";
        const owner = relation || "specify";
        let pronouns = 'his/her'

        if (male.includes(relation_owner) && error_in === 'the') {
            pronouns = 'his'
        }
        else if (female.includes(relation_owner) && error_in === 'the') {
            pronouns = 'her'
        }

        return `To correct the above-mentioned clerical error in ${owner} Certificate of Death which is inconsistent with all of ${pronouns} documents. `;
    } else {
        return `To correct the `;
    }
}