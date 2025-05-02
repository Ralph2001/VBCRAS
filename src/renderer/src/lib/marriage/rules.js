import { useVuelidate } from "@vuelidate/core";
import { helpers, minLength, numeric, required, requiredIf } from "@vuelidate/validators";

export const MarriageRules = {

    groom_contract_marriage_with: { required },
    bride_contract_marriage_with: { required },


    // Groom Details
    groom_first_name: { required, minLength: minLength(2) },
    groom_last_name: { required, minLength: minLength(2) },
    groom_date_birth: { required },
    groom_age: { required, numeric },
    groom_municipality: { required },
    
    groom_country: { required },
    groom_sex: { required },
    groom_citizenship: { required },
    groom_residence: { required },
    // groom_residence_country: { required },
    groom_religion: { required },
    groom_civil_status: { required },
    groom_degree_relation: { required },

    // Groom Father Details
    groom_father_first_name: { required, minLength: minLength(2) },
    groom_father_last_name: { required, minLength: minLength(2) },
    groom_father_citizenship: { required },
    groom_father_residence: { required },
    // groom_father_residence_country: { required },

    // Groom Mother Details
    groom_mother_first_name: { required, minLength: minLength(2) },
    groom_mother_last_name: { required, minLength: minLength(2) },
    groom_mother_citizenship: { required },
    groom_mother_residence: { required },
    // groom_mother_residence_country: { required },

    // Groom Consent
    groom_person_who_gave_consent: { required },
    groom_person_who_gave_consent_relation: { required },
    groom_person_who_gave_consent_citizenship: { required },
    groom_person_who_gave_consent_residence: { required },

    // Groom Subscribe Sworn and CTC

    groom_ctc_number: { required },
    groom_ctc_on: { required },
    groom_ctc_at: { required },



    // Bride Details
    bride_first_name: { required, minLength: minLength(2) },
    bride_last_name: { required, minLength: minLength(2) },
    bride_date_birth: { required },
    bride_age: { required, numeric },
    bride_municipality: { required },
    bride_country: { required },
    bride_sex: { required },
    bride_citizenship: { required },
    bride_residence: { required },
    // bride_residence_country: { required },
    bride_religion: { required },
    bride_civil_status: { required },
    bride_degree_relation: { required },
    // Bride Father Details
    bride_father_first_name: { required, minLength: minLength(2) },
    bride_father_last_name: { required, minLength: minLength(2) },
    bride_father_citizenship: { required },
    bride_father_residence: { required },
    // bride_father_residence_country: { required },
    // Bride Mother Details
    bride_mother_first_name: { required, minLength: minLength(2) },
    bride_mother_last_name: { required, minLength: minLength(2) },
    bride_mother_citizenship: { required },
    bride_mother_residence: { required },
    // bride_mother_residence_country: { required },

    // Bride Consent
    bride_person_who_gave_consent: { required },
    bride_person_who_gave_consent_relation: { required },
    bride_person_who_gave_consent_citizenship: { required },
    bride_person_who_gave_consent_residence: { required },

    // Bride Subscribe Sworn and CTC

    bride_ctc_number: { required },
    bride_ctc_on: { required },
    bride_ctc_at: { required },


    // All Notice Fields
    notice_groom_name: { required },
    notice_bride_name: { required },
    notice_groom_age: { required },
    notice_groom_birthplace: { required },
    notice_groom_residence: { required },
    notice_groom_father: { required },
    notice_groom_mother: { required },
    notice_bride_age: { required },
    notice_bride_birthplace: { required },
    notice_bride_residence: { required },
    notice_bride_father: { required },
    notice_bride_mother: { required },
    notice_date_posting: { required },


    // notice_position: { required },
    // groom_place_dissolved: { required },
    // groom_date_dissolved: { required },
    // bride_place_dissolved: { required },
    // bride_date_dissolved: { required },
    // groom_previously_married_dissolved: { required },
    // bride_previously_married_dissolved: { required },
    // groom_place_dissolved_municipality: { required },
    // groom_place_dissolved_province: { required },
    // groom_place_dissolved_country: { required },
    // groom_date_dissolved_day: { required, numeric },
    // groom_date_dissolved_month: { required, numeric },
    // groom_date_dissolved_year: { required, numeric },
    // bride_place_dissolved_municipality: { required },
    // bride_place_dissolved_province: { required },
    // bride_place_dissolved_country: { required },
    // bride_date_dissolved_day: { required, numeric },
    // bride_date_dissolved_month: { required, numeric },
    // bride_date_dissolved_year: { required, numeric },
}
