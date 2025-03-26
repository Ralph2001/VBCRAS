
from ..extensions import db

class BaseCertificate(db.Model):
    __abstract__ = True  # Abstract base class won't create a table


    id = db.Column(db.Integer, primary_key=True)
    date_filed = db.Column(db.Date, nullable=False)
    certification_issued_to = db.Column(db.String(255))
    verified_by = db.Column(db.String(255))
    verifier_position = db.Column(db.String(255))
    civil_registrar = db.Column(db.String(255))
    civil_registrar_position = db.Column(db.String(255))
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    is_with_authentication = db.Column(db.Boolean, default=False)
    remarks = db.Column(db.Text)

class PaymentMixin:
    """Payment-related fields for forms with financial transactions"""
    amount_paid = db.Column(db.Numeric(10, 2))
    or_number = db.Column(db.String(50))
    date_paid = db.Column(db.Date)

class AvailableForm(db.Model):
    __tablename__ = 'Available'
    __table_args__ = (db.Index("idx_registry_number", "registry_number"),)

    type = db.Column(db.String(10), nullable=False) #Birth, Death, Marriage
    date_registration = db.Column(db.Date)
    page_number = db.Column(db.String(20))
    book_number = db.Column(db.String(20))
    registry_number = db.Column(db.String(50), unique=True)

    person_name = db.Colum(db.String(255), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    age = db.Column(db.String(10), nullable=False)
    date_of_event = db.Column(db.String(10), nullable=False)
    place_of_event = db.Column(db.String(10), nullable=False)
    cause_of_event = db.Column(db.String(10), nullable=False)
    civil_status = db.Column(db.String(10), nullable=False)
    citizenship = db.Column(db.String(10), nullable=False)
    
    name_mother = db.Column(db.String(255), nullable=False)
    citizenship_mother = db.Column(db.String(100))
    name_father = db.Column(db.String(255))
    citizenship_father = db.Column(db.String(100))
    
    # Parents' marriage details, For Form 1A (birth)
    date_marriage_parents = db.Column(db.Date)
    place_marriage_parents = db.Column(db.String(255))

    # For Form 3A Since it's Marriage
    groom_name = db.Column(db.String(255))
    groom_date_birth = db.Column(db.Date)
    groom_age = db.Column(db.Integer)
    groom_citizenship = db.Column(db.String(100))
    groom_civil_status = db.Column(db.String(50))
    groom_mother = db.Column(db.String(255))
    groom_father = db.Column(db.String(255))
    
    bride_name = db.Column(db.String(255))
    bride_date_birth = db.Column(db.Date)
    bride_age = db.Column(db.Integer)
    bride_citizenship = db.Column(db.String(100))
    bride_civil_status = db.Column(db.String(50))
    bride_mother = db.Column(db.String(255))
    bride_father = db.Column(db.String(255))
