from ..extensions import db

class DocumentAvailable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Transaction Details
    date_filed = db.Column(db.Date, nullable=False)
    certification_issued_to = db.Column(db.String(255))
    verified_by = db.Column(db.String(255))
    verifier_position = db.Column(db.String(255))
    civil_registrar = db.Column(db.String(255))
    civil_registrar_position = db.Column(db.String(255))
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Document Attributes
    is_with_authentication = db.Column(db.Boolean, default=False)
    date_registration = db.Column(db.Date)
    page_number = db.Column(db.String(20))
    book_number = db.Column(db.String(20))
    registry_number = db.Column(db.String(50))
    remarks = db.Column(db.Text)

    # Document Information
    document_name = db.Column(db.String(255))
    sex = db.Column(db.String(10))
    date_of_event = db.Column(db.Date)
    place_event = db.Column(db.String(255))

    # This is for Form 2A Only since form 2A is Death 
    document_owner_age = db.Column(db.String(100)) 
    document_owner_civil_status = db.Column(db.String(100))
    document_owner_citizenship = db.Column(db.String(100))
    cause_of_event = db.Column(db.String(255))

    # This is for Form 3A since it is Marriage
    groom_name = db.Column(db.String(255), nullable=False)
    groom_date_birth = db.Column(db.Date)
    groom_age = db.Column(db.Integer)
    groom_citizenship = db.Column(db.String(100))
    groom_civil_status = db.Column(db.String(50))
    groom_mother = db.Column(db.String(255))
    groom_father = db.Column(db.String(255))
    
    # Bride information
    bride_name = db.Column(db.String(255), nullable=False)
    bride_date_birth = db.Column(db.Date)
    bride_age = db.Column(db.Integer)
    bride_citizenship = db.Column(db.String(100))
    bride_civil_status = db.Column(db.String(50))
    bride_mother = db.Column(db.String(255))
    bride_father = db.Column(db.String(255))

    name_mother = db.Column(db.String(255))
    citizenship_mother = db.Column(db.String(100))
    name_father = db.Column(db.String(255))
    citizenship_father = db.Column(db.String(100))

    date_marriage_parents = db.Column(db.Date)
    place_marriage_parents = db.Column(db.String(255))