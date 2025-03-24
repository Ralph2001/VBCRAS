import { format } from "date-fns"

export const useTransactionDetails = {
    date_filed: format(new Date(), "MMMM dd, yyyy"),
    certification_issued_to: '',
    verified_by: 'ERIKA JOYCE B. PARAGAS',
    verifier_position: 'Registration Officer I',
    civil_registrar: 'ISMAEL D. MALICDEM, JR.',
    civil_registrar_position: 'Municipal Civil Registrar',
    created_by: '',
    amount_paid: 'Php 130.00',
    or_number: '',
    date_paid: format(new Date(), "MMMM dd, yyyy"),
    is_with_authentication: false,
    for_and_in_the_absence: false,
    absence_verified_by: 'GLENN ALBERT R. MALICDEM',
    absence_verifier_position: 'Administrative Aide III',
}
export const useRegisteredPeriod = {
    registered_from: '',
    from_year: '',
    to_year: '',
    destroyed_by: '',
}
export const useAvailableForm = {
    date_registration: '',
    page_number: '',
    book_number: '',
    registry_number: '',
    is_reconstructed: false,
    is_other_remarks: false,
    remarks: '',
}

export const useForm1A = {
    name_child: '',
    sex: '',
    date_birth: '',
    place_birth: '',
    name_mother: '',
    citizenship_mother: '',
    name_father: '',
    citizenship_father: '',
    date_marriage_parents: '',
    place_marriage_parents: '',

}

export const useForm2A = {
    name_deceased: '',
    sex: '',
    deceased_age: '',
    deceased_civil_status: '',
    deceased_citizenship: '',
    date_of_death: '',
    place_of_death: '',
    cause_of_death: '',

}

export const useForm3A = {
    groom_name: '',
    groom_date_birth: '',
    groom_age: '',
    groom_citizenship: '',
    groom_civil_status: '',
    groom_mother: '',
    groom_father: '',
    bride_name: '',
    bride_date_birth: '',
    bride_age: '',
    bride_citizenship: '',
    bride_civil_status: '',
    bride_mother: '',
    bride_father: '',
    date_marriage: '',
    place_marriage: '',

}


export const useForm1B = {
    no_record_birth_of: '',
    born_on: '',
    mother_name: '',
    father_name: '',
    intact_birth_year: '',

}
export const useForm2B = {
    no_record_death_of: '',
    born_on: '',
    mother_name: '',
    father_name: '',
    intact_birth_year: '',

}
export const useForm3B = {
    no_record_marriage_of: '',
    married_on: '',
    intact_marriage_year: '',
}

export const useForm1C = {
    birth_name: '',
    born_on: '',
    ...useRegisteredPeriod
}
export const useForm2C = {
    death_name: '',
    died_on: '',
    ...useRegisteredPeriod
}
export const useForm3C = {
    marriage_name: '',
    married_on: '',
    ...useRegisteredPeriod
}
