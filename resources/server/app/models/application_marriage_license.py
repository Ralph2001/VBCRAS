from ..extensions import db


class ApplicationMarriageLicense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    file_path = db.Column(db.String, nullable=False)

    header_province = db.Column(db.String, nullable=True)
    header_municipality = db.Column(db.String, nullable=True)
    registry_number = db.Column(db.String, nullable=True)
    received_by = db.Column(db.String, nullable=True)
    date_of_receipt = db.Column(db.String, nullable=True)
    marriage_license_number = db.Column(db.String, nullable=True)
    date_issuance_marriage_license = db.Column(db.String, nullable=True)
    groom_contract_marriage_with = db.Column(db.String, nullable=True)
    bride_contract_marriage_with = db.Column(db.String, nullable=True)

    civil_registrar = db.Column(db.String, nullable=True)

    groom_first_name = db.Column(db.String, nullable=True)
    groom_middle_name = db.Column(db.String, nullable=True)
    groom_last_name = db.Column(db.String, nullable=True)

    groom_day = db.Column(db.String, nullable=True)
    groom_month = db.Column(db.String, nullable=True)
    groom_year = db.Column(db.String, nullable=True)

    groom_age = db.Column(db.String, nullable=True)

    groom_municipality = db.Column(db.String, nullable=True)
    groom_province = db.Column(db.String, nullable=True)
    groom_country = db.Column(db.String, nullable=True)

    groom_sex = db.Column(db.String, nullable=True)
    groom_citizenship = db.Column(db.String, nullable=True)
    groom_residence = db.Column(db.String, nullable=True)
    groom_residence_country = db.Column(db.String, nullable=True)
    groom_religion = db.Column(db.String, nullable=True)
    groom_civil_status = db.Column(db.String, nullable=True)
    groom_previously_married_dissolved = db.Column(db.String, nullable=True)
    groom_place_dissolved = db.Column(db.String, nullable=True)
    groom_date_dissolved = db.Column(db.String, nullable=True)
    groom_degree_relation = db.Column(db.String, nullable=True)
    groom_father_first_name = db.Column(db.String, nullable=True)
    groom_father_middle_name = db.Column(db.String, nullable=True)
    groom_father_last_name = db.Column(db.String, nullable=True)
    groom_father_citizenship = db.Column(db.String, nullable=True)
    groom_father_residence = db.Column(db.String, nullable=True)
    groom_father_residence_country = db.Column(db.String, nullable=True)
    groom_mother_first_name = db.Column(db.String, nullable=True)
    groom_mother_middle_name = db.Column(db.String, nullable=True)
    groom_mother_last_name = db.Column(db.String, nullable=True)
    groom_mother_citizenship = db.Column(db.String, nullable=True)
    groom_mother_residence = db.Column(db.String, nullable=True)
    groom_mother_residence_country = db.Column(db.String, nullable=True)
    groom_person_who_gave_consent = db.Column(db.String, nullable=True)
    groom_person_who_gave_consent_relation = db.Column(db.String, nullable=True)
    groom_person_who_gave_consent_citizenship = db.Column(db.String, nullable=True)
    groom_person_who_gave_consent_residence = db.Column(db.String, nullable=True)
    groom_person_who_gave_consent_residence_country = db.Column(
        db.String, nullable=True
    )

    groom_ss_day = db.Column(db.String, nullable=True)
    groom_ss_month = db.Column(db.String, nullable=True)
    groom_ss_year = db.Column(db.String, nullable=True)
    groom_ss_at = db.Column(db.String, nullable=True)
    groom_ctc_number = db.Column(db.String, nullable=True)
    groom_ctc_on = db.Column(db.String, nullable=True)
    groom_ctc_at = db.Column(db.String, nullable=True)

    bride_first_name = db.Column(db.String, nullable=True)
    bride_middle_name = db.Column(db.String, nullable=True)
    bride_last_name = db.Column(db.String, nullable=True)

    bride_day = db.Column(db.String, nullable=True)
    bride_month = db.Column(db.String, nullable=True)
    bride_year = db.Column(db.String, nullable=True)

    bride_age = db.Column(db.String, nullable=True)
    bride_municipality = db.Column(db.String, nullable=True)
    bride_province = db.Column(db.String, nullable=True)
    bride_country = db.Column(db.String, nullable=True)
    bride_sex = db.Column(db.String, nullable=True)
    bride_citizenship = db.Column(db.String, nullable=True)
    bride_residence = db.Column(db.String, nullable=True)
    bride_residence_country = db.Column(db.String, nullable=True)
    bride_religion = db.Column(db.String, nullable=True)
    bride_civil_status = db.Column(db.String, nullable=True)
    bride_previously_married_dissolved = db.Column(db.String, nullable=True)
    bride_place_dissolved = db.Column(db.String, nullable=True)
    bride_date_dissolved = db.Column(db.String, nullable=True)
    bride_degree_relation = db.Column(db.String, nullable=True)
    bride_father_first_name = db.Column(db.String, nullable=True)
    bride_father_middle_name = db.Column(db.String, nullable=True)
    bride_father_last_name = db.Column(db.String, nullable=True)
    bride_father_citizenship = db.Column(db.String, nullable=True)
    bride_father_residence = db.Column(db.String, nullable=True)
    bride_father_residence_country = db.Column(db.String, nullable=True)
    bride_mother_first_name = db.Column(db.String, nullable=True)
    bride_mother_middle_name = db.Column(db.String, nullable=True)
    bride_mother_last_name = db.Column(db.String, nullable=True)
    bride_mother_citizenship = db.Column(db.String, nullable=True)
    bride_mother_residence = db.Column(db.String, nullable=True)
    bride_mother_residence_country = db.Column(db.String, nullable=True)
    bride_person_who_gave_consent = db.Column(db.String, nullable=True)
    bride_person_who_gave_consent_relation = db.Column(db.String, nullable=True)
    bride_person_who_gave_consent_citizenship = db.Column(db.String, nullable=True)
    bride_person_who_gave_consent_residence = db.Column(db.String, nullable=True)
    bride_person_who_gave_consent_residence_country = db.Column(
        db.String, nullable=True
    )

    bride_ss_day = db.Column(db.String, nullable=True)
    bride_ss_month = db.Column(db.String, nullable=True)
    bride_ss_year = db.Column(db.String, nullable=True)
    bride_ss_at = db.Column(db.String, nullable=True)
    bride_ctc_number = db.Column(db.String, nullable=True)
    bride_ctc_on = db.Column(db.String, nullable=True)
    bride_ctc_at = db.Column(db.String, nullable=True)

    notice_province = db.Column(db.String, nullable=True)
    notice_municipality = db.Column(db.String, nullable=True)
    notice_office = db.Column(db.String, nullable=True)
    notice_groom_name = db.Column(db.String, nullable=True)
    notice_bride_name = db.Column(db.String, nullable=True)
    notice_groom_age = db.Column(db.String, nullable=True)
    notice_groom_birthplace = db.Column(db.String, nullable=True)
    notice_groom_residence = db.Column(db.String, nullable=True)
    notice_groom_father = db.Column(db.String, nullable=True)
    notice_groom_mother = db.Column(db.String, nullable=True)
    notice_bride_age = db.Column(db.String, nullable=True)
    notice_bride_birthplace = db.Column(db.String, nullable=True)
    notice_bride_residence = db.Column(db.String, nullable=True)
    notice_bride_father = db.Column(db.String, nullable=True)
    notice_bride_mother = db.Column(db.String, nullable=True)
    notice_date_posting = db.Column(db.String, nullable=True)
    notice_position = db.Column(db.String, nullable=True)
    notice_copy_furnished1 = db.Column(db.String, nullable=True)
    notice_copy_furnished2 = db.Column(db.String, nullable=True)
    notice_copy_furnished3 = db.Column(db.String, nullable=True)
    notice_copy_furnished4 = db.Column(db.String, nullable=True)
