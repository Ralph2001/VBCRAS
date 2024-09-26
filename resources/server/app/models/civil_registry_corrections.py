from ..extensions import db
import datetime

class Petitions(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    # Petition
    is_migrant =  db.Column(db.Boolean, default=False)
    # is_with_cert_filing = db.Column(db.Boolean, default=False)

    # Person who create the document
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status =  db.Column(db.String, default="PENDING")

    date_filed = db.Column(db.String)
    republic_act_number = db.Column(db.String)
    petition_type = db.Column(db.String)  # CCE or CFN
    event_type = db.Column(db.String)  # Birth, Death and Marriage
    # Petition Detail
    petition_number = db.Column(db.String)
    petitioner_name = db.Column(db.String)
    nationality = db.Column(db.String)
    petitioner_address = db.Column(db.String)
    petitioner_error_in = db.Column(db.String)
    document_owner = db.Column(db.String)
    relation_owner = db.Column(db.String)
    event_date = db.Column(db.String)
    event_country = db.Column(db.String)
    event_province = db.Column(db.String)
    event_municipality = db.Column(db.String)
    # Registry Number
    registry_number = db.Column(db.String)
    # Filing
    filing_city_municipality = db.Column(db.String)
    filing_province = db.Column(db.String)
    # Subscribe and Sworn Section
    administering_officer_name = db.Column(db.String)
    administering_officer_position = db.Column(db.String)
    subscribe_sworn_date = db.Column(db.String)
    subscribe_sworn_city_municipality = db.Column(db.String)
    
    # community_tax_certificate = db.Column(db.String)
    exhibiting_his_her = db.Column(db.String)
    exhibiting_number = db.Column(db.String)
    
    issued_at = db.Column(db.String)
    issued_on = db.Column(db.String)
    # Actions
    action_taken_date = db.Column(db.String)
    municipal_civil_registrar = db.Column(db.String)
    # Payment
    o_r_number = db.Column(db.String)  # maybe indigent
    amount_paid = db.Column(db.String)  # maybe indigent
    date_paid = db.Column(db.String)  # maybe indigent

    # Petition Dates
    notice_posting = db.Column(db.String)
    certificate_posting_start = db.Column(db.String)
    certificate_posting_end = db.Column(db.String)
    petition_date_issued = db.Column(db.String)
    petition_date_granted = db.Column(db.String)


    # Publication for CFN and 10172
    publication_start =  db.Column(db.String, nullable=True)
    publication_end =  db.Column(db.String, nullable=True)



    # Change of First Name fields (nullable, for CFN document type only)
    first_name_from = db.Column(db.String, nullable=True)
    first_name_to = db.Column(db.String, nullable=True)
    ground_a = db.Column(db.Boolean, nullable=True, default=False)
    ground_b = db.Column(db.Boolean, nullable=True, default=False)
    ground_c = db.Column(db.Boolean, nullable=True, default=False)
    ground_d = db.Column(db.Boolean, nullable=True, default=False)
    ground_e = db.Column(db.Boolean, nullable=True, default=False)
    ground_f = db.Column(db.Boolean, nullable=True, default=False)
    ground_b_data = db.Column(db.String, nullable=True)
    ground_f_data = db.Column(db.String, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    # Remarks
    remarks = db.Column(db.String(455), nullable=True)

    # Is Person Indigent?
    is_indigent = db.Column(db.Boolean, nullable=False, default=False)

    # File Path. What if it's gone???
    file_path = db.Column(db.String, nullable=True)

    # Relationships (nullable for CFN document type)
    clerical_errors = db.relationship(
        "PetitionClericalErrors", backref="petition", lazy=True
    )
    supporting_documents = db.relationship(
        "PetitionSupportingDocuments", backref="petition", lazy=True
    )



    petition_actions = db.relationship("PetitionActions", backref="petition", lazy=True)
    petition_reasons = db.relationship("PetitionReasons", backref="petition", lazy=True)
    


class PetitionClericalErrors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer, db.ForeignKey("petitions.id"), nullable=False)
    error_num = db.Column(db.String)
    description = db.Column(db.String)
    error_description_from = db.Column(db.String)
    error_description_to = db.Column(db.String)


class PetitionSupportingDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer, db.ForeignKey("petitions.id"), nullable=False)
    document_name = db.Column(db.String)


class PetitionActions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer, db.ForeignKey("petitions.id"), nullable=False)
    error_num = db.Column(db.Integer)
    action_decision = db.Column(db.String)
    action_text = db.Column(db.String)


class PetitionReasons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer, db.ForeignKey("petitions.id"), nullable=False)
    error_num = db.Column(db.String)
    reason = db.Column(db.String)
