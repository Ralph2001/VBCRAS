from ..extensions import db
from ..models.user import Users


class ApplicationMarriageLicense(db.Model):
    __tablename__ = 'marriage_records'

    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)


    user = db.relationship("Users", backref="marriage_records")
    file_path = db.Column(db.String(455))

    header_province = db.Column(db.String(100))
    header_municipality = db.Column(db.String(100))
    registry_number = db.Column(db.String(50))
    received_by = db.Column(db.String(150))
    date_of_marriage = db.Column(db.String(150))
    date_of_receipt = db.Column(db.String(150))

    marriage_license_number = db.Column(db.String(50))
    date_issuance_marriage_license = db.Column(db.String(150))

    groom_contract_marriage_with = db.Column(db.String(150))
    bride_contract_marriage_with = db.Column(db.String(150))

    place_of_marriage = db.Column(db.String(200))
    civil_registrar = db.Column(db.String(150))

    # Groom details
    groom_first_name = db.Column(db.String(100))
    groom_middle_name = db.Column(db.String(100))
    groom_last_name = db.Column(db.String(100))
    groom_date_birth = db.Column(db.String(150))
    groom_age = db.Column(db.String(10))
    groom_municipality = db.Column(db.String(100))
    groom_province = db.Column(db.String(100))
    groom_country = db.Column(db.String(100))
    groom_sex = db.Column(db.String(10), default='MALE')
    groom_citizenship = db.Column(db.String(100))
    groom_residence = db.Column(db.String(150))
    groom_residence_country = db.Column(db.String(100))
    groom_religion = db.Column(db.String(100))
    groom_civil_status = db.Column(db.String(50), default='SINGLE')
    groom_degree_relation = db.Column(db.String(100))

    # Groom parents
    groom_father_first_name = db.Column(db.String(100))
    groom_father_middle_name = db.Column(db.String(100))
    groom_father_last_name = db.Column(db.String(100))
    groom_father_citizenship = db.Column(db.String(100))
    groom_father_residence = db.Column(db.String(150))
    groom_father_residence_country = db.Column(db.String(100))

    groom_mother_first_name = db.Column(db.String(100))
    groom_mother_middle_name = db.Column(db.String(100))
    groom_mother_last_name = db.Column(db.String(100))
    groom_mother_citizenship = db.Column(db.String(100))
    groom_mother_residence = db.Column(db.String(150))
    groom_mother_residence_country = db.Column(db.String(100))

    # Groom consent
    groom_person_who_gave_consent = db.Column(db.String(100))
    groom_person_who_gave_consent_relation = db.Column(db.String(100))
    groom_person_who_gave_consent_citizenship = db.Column(db.String(100))
    groom_person_who_gave_consent_residence = db.Column(db.String(150))

    # Groom self-signature
    groom_ss_day = db.Column(db.String(10))
    groom_ss_month = db.Column(db.String(20))
    groom_ss_year = db.Column(db.String(10))
    groom_ss_at = db.Column(db.String(150))
    groom_ctc_number = db.Column(db.String(100))
    groom_ctc_on = db.Column(db.String(20))
    groom_ctc_at = db.Column(db.String(150))

    # Bride details
    bride_first_name = db.Column(db.String(100))
    bride_middle_name = db.Column(db.String(100))
    bride_last_name = db.Column(db.String(100))
    bride_date_birth = db.Column(db.String(150))
    bride_age = db.Column(db.String(10))
    bride_municipality = db.Column(db.String(100))
    bride_province = db.Column(db.String(100))
    bride_country = db.Column(db.String(100))
    bride_sex = db.Column(db.String(10), default='FEMALE')
    bride_citizenship = db.Column(db.String(100))
    bride_residence = db.Column(db.String(150))
    bride_residence_country = db.Column(db.String(100))
    bride_religion = db.Column(db.String(100))
    bride_civil_status = db.Column(db.String(50), default='SINGLE')
    bride_degree_relation = db.Column(db.String(100))

    # Bride parents
    bride_father_first_name = db.Column(db.String(100))
    bride_father_middle_name = db.Column(db.String(100))
    bride_father_last_name = db.Column(db.String(100))
    bride_father_citizenship = db.Column(db.String(100))
    bride_father_residence = db.Column(db.String(150))
    bride_father_residence_country = db.Column(db.String(100))

    bride_mother_first_name = db.Column(db.String(100))
    bride_mother_middle_name = db.Column(db.String(100))
    bride_mother_last_name = db.Column(db.String(100))
    bride_mother_citizenship = db.Column(db.String(100))
    bride_mother_residence = db.Column(db.String(150))
    bride_mother_residence_country = db.Column(db.String(100))

    # Bride consent
    bride_person_who_gave_consent = db.Column(db.String(100))
    bride_person_who_gave_consent_relation = db.Column(db.String(100))
    bride_person_who_gave_consent_citizenship = db.Column(db.String(100))
    bride_person_who_gave_consent_residence = db.Column(db.String(150))

    # Bride self-signature
    bride_ss_day = db.Column(db.String(10))
    bride_ss_month = db.Column(db.String(20))
    bride_ss_year = db.Column(db.String(10))
    bride_ss_at = db.Column(db.String(150))
    bride_ctc_number = db.Column(db.String(100))
    bride_ctc_on = db.Column(db.String(20))
    bride_ctc_at = db.Column(db.String(150))

    # Notice fields
    notice_province = db.Column(db.String(100))
    notice_municipality = db.Column(db.String(100))
    notice_office = db.Column(db.String(150))
    notice_groom_name = db.Column(db.String(150))
    notice_bride_name = db.Column(db.String(150))
    notice_groom_age = db.Column(db.String(150))
    notice_groom_birthplace = db.Column(db.String(100))
    notice_groom_residence = db.Column(db.String(150))
    notice_groom_father = db.Column(db.String(150))
    notice_groom_mother = db.Column(db.String(150))
    notice_bride_age = db.Column(db.String(150))
    notice_bride_birthplace = db.Column(db.String(100))
    notice_bride_residence = db.Column(db.String(150))
    notice_bride_father = db.Column(db.String(150))
    notice_bride_mother = db.Column(db.String(150))
    notice_date_posting = db.Column(db.String(50))
    notice_position = db.Column(db.String(100))
    notice_copy_furnished1 = db.Column(db.String(100))
    notice_copy_furnished2 = db.Column(db.String(100))
    notice_copy_furnished3 = db.Column(db.String(100))
    notice_copy_furnished4 = db.Column(db.String(100))

    # Dissolution info
    groom_place_dissolved = db.Column(db.String(150))
    groom_date_dissolved = db.Column(db.String(50))
    bride_place_dissolved = db.Column(db.String(150))
    bride_date_dissolved = db.Column(db.String(50))
    groom_previously_married_dissolved = db.Column(db.String(50), default='N/A')
    bride_previously_married_dissolved = db.Column(db.String(50), default='N/A')

    groom_place_dissolved_municipality = db.Column(db.String(100))
    groom_place_dissolved_province = db.Column(db.String(100))
    groom_place_dissolved_country = db.Column(db.String(100))

    bride_place_dissolved_municipality = db.Column(db.String(100))
    bride_place_dissolved_province = db.Column(db.String(100))
    bride_place_dissolved_country = db.Column(db.String(100))