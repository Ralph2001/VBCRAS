from ..extensions import db


class Ausf(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
     registry_number = db.Column(db.String, nullable=False)
     date_registration = db.Column(db.String, nullable=False)
     affiant_name = db.Column(db.String, nullable=False)
     citizenship = db.Column(db.String, nullable=False)
     age = db.Column(db.String, nullable=False)
     address = db.Column(db.String, nullable=False)
     surname = db.Column(db.String, nullable=False)
     in_my_the = db.Column(db.String, nullable=False)
     child_name = db.Column(db.String, nullable=False)
     relation = db.Column(db.String, nullable=False)
     date_birth = db.Column(db.String, nullable=False)
     at_municipality = db.Column(db.String, nullable=False)
     at_province = db.Column(db.String, nullable=False)
     at_country = db.Column(db.String, nullable=False)
     lcro_at = db.Column(db.String, nullable=False)
     day_signature = db.Column(db.String, nullable=False)
     month_signature = db.Column(db.String, nullable=False)
     sworn_day = db.Column(db.String, nullable=False)
     sworn_month = db.Column(db.String, nullable=False)
     sworn_at = db.Column(db.String, nullable=False)
     exhibiting = db.Column(db.String, nullable=False)
     exhibiting_number= db.Column(db.String, nullable=False)
     exhibiting_at = db.Column(db.String, nullable=False)
     exhibiting_on = db.Column(db.String, nullable=False)
    # If Applicable
     ap_phi_registry_number = db.Column(db.String, nullable=False)
     ap_phi_date_registration = db.Column(db.String, nullable=False)
     pfsp_of = db.Column(db.String, nullable=False)
     
     isWithAttestation = db.Column(db.Boolean, nullable=False)   
     attestation_name = db.Column(db.String, nullable=True)   
     attestation_address = db.Column(db.String, nullable=True)   
     attestation_relation = db.Column(db.String, nullable=True)   
     attestation_signature_day = db.Column(db.String, nullable=True)   
     attestation_signature_month = db.Column(db.String, nullable=True)   
     attestation_signature = db.Column(db.String, nullable=True)   
     attestation_ss_day = db.Column(db.String, nullable=True)   
     attestation_ss_month_year = db.Column(db.String, nullable=True)   
     attestation_exhibiting_her = db.Column(db.String, nullable=True)   
     attestation_exhibiting_number = db.Column(db.String, nullable=True)   
     attestation_issued_at = db.Column(db.String, nullable=True)   
     attestation_issued_on = db.Column(db.String, nullable=True)   
     # attestation_ = db.Column(db.String, nullable=True)   
     
    #  def to_dict(self):
    #     return {
    #         "id": self.id,
    #         "registry_number": self.registry_number,
    #         "date_registration": self.date_registration,
    #         "affiant_name": self.affiant_name,
    #         "citizenship": self.citizenship,
    #         "age": self.age,
    #         "address": self.address,
    #         "surname": self.surname,
    #         "in_my_the": self.in_my_the,
    #         "child_name": self.child_name,
    #         "relation": self.relation,
    #         "date_birth": self.date_birth,
    #         "at_municipality": self.at_municipality,
    #         "at_province": self.at_province,
    #         "at_country": self.at_country,
    #         "lcro_at": self.lcro_at,
    #         "day_signature": self.day_signature,
    #         "month_signature": self.month_signature,
    #         "sworn_day": self.sworn_day,
    #         "sworn_month": self.sworn_month,
    #         "sworn_at": self.sworn_at,
    #         "exhibiting": self.exhibiting,
    #         "exhibiting_number": self.exhibiting_number,
    #         "exhibiting_at": self.exhibiting_at,
    #         "exhibiting_on": self.exhibiting_on,
    #         "ap_phi_registry_number": self.ap_phi_registry_number,
    #         "ap_phi_date_registration": self.ap_phi_date_registration,
    #         "pfsp_of": self.pfsp_of
    #     }