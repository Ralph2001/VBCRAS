export function grantedText(data) {
    if ((data.value.type === "CFN" && data.value.from !== "") || data.value.to !== "") {
        const fromValue = data.value.from || "(from)";
        const toValue = data.value.to || "(to)";
        return `Finding the petition sufficient in form and substance, the same is hereby GRANTED, the child’s first name from "${fromValue}" to "${toValue}" is hereby changed. `;
    } else if (
        (data.value.type === "CCE" && data.value.document_type === "Birth") ||
        data.value.document_type === "Death" ||
        data.value.document_type === "Marriage"
    ) {
        const errorStrings = [];

        for (
            let i = 0;
            i < data.value.clerical_errors.description.length ||
            i < data.value.clerical_errors.from.length ||
            i < data.value.clerical_errors.to.length;
            i++
        ) {
            const description = data.value.clerical_errors.description[i] || "(description)";
            const fromValue = data.value.clerical_errors.from[i] || "(from)";
            const toValue = data.value.clerical_errors.to[i] || "(to)";

            errorStrings.push(
                `the ${description.toLowerCase()} from "${fromValue}" to "${toValue}"`
            );
        }

        const lastItem = errorStrings.pop();
        const formattedOutput =
            errorStrings.join("; ") + (errorStrings.length ? " and " : "") + lastItem;

            
        return `Finding the petition sufficient in form and substance, the same is hereby GRANTED, ${formattedOutput} is hereby changed.`;
    }
}