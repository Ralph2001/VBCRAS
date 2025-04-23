import { differenceInYears, isValid, parseISO } from "date-fns"

export const MarriageSteps =
    ['Marriage Details',
        'Groom Info',
        'Groom Parents',
        'Bride Info',
        'Bride Parents',
        'Community Tax Certificate',
        'Notice of Posting',
        'Preview & Save']

export const CivilStatus = [
    'SINGLE',
    'WIDOWED',
    'WIDOWER',
    'DIVORCED',
    'ANNULLED',
]

export function calculateAge(date) {
    const parsedDate = parseISO(date ?? '')
    if (!isValid(parsedDate)) return null

    const age = differenceInYears(new Date(), parsedDate)
    return age.toString()
}

export const capitalizeName = (name) => {
    return name ? name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
};

export const formatFullName = (firstName, middleName, lastName) => {
    if (!firstName || !lastName) return '';
    const middleInitial = middleName ? capitalizeName(middleName.charAt(0)) + '.' : '';
    return `${capitalizeName(firstName)} ${middleInitial} ${capitalizeName(lastName)}`.trim();
};

export const formatResidence = (residence) => {
    return residence
        .split(',')
        .map(part => part.trim())
        .filter(part => !part.toUpperCase().includes('PHILIPPINES'))
        .map(capitalizeName)
        .join(', ');
};

export function removeBase64Prefix(base64String) {
    return base64String.replace(/^data:application\/pdf;base64,/, '');
}