export function grantedText(data) {
    if ((data.value.petition_type === "CFN" && data.value.from !== "") || data.value.to !== "") {
        const fromValue = data.value.from || "(from)";
        const toValue = data.value.to || "(to)";
        return `Finding the petition sufficient in form and substance, the same is hereby GRANTED, the child’s first name from "${fromValue}" to "${toValue}" is hereby changed. `;
    }
    else if (
        (data.value.petition_type === "CCE" && data.value.event_type === "Birth") ||
        data.value.event_type === "Death" ||
        data.value.event_type === "Marriage"
    ) {
        const errorStrings = [];

        for (let i = 0; i < data.value.clerical_errors.length; i++) {
            const description = data.value.clerical_errors[i].description || "(description)";
            const fromValue = data.value.clerical_errors[i].error_description_from || "(from)";
            const toValue = data.value.clerical_errors[i].error_description_to || "(to)";

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