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

class AvailableMixin:
    """Fields for forms with available records"""
    is_with_authentication = db.Column(db.Boolean, default=False)
    date_registration = db.Column(db.Date)
    page_number = db.Column(db.String(20))
    book_number = db.Column(db.String(20))
    registry_number = db.Column(db.String(50), unique=True)
    remarks = db.Column(db.Text)

class PaymentMixin:
    """Payment-related fields for forms with financial transactions"""
    amount_paid = db.Column(db.Numeric(10, 2))
    or_number = db.Column(db.String(50))
    date_paid = db.Column(db.Date)

class RegisteredPeriodMixin:
    """Fields for forms tracking registration periods"""
    registered_from = db.Column(db.String(255))
    from_year = db.Column(db.Integer)
    to_year = db.Column(db.Integer)
    destroyed_by = db.Column(db.String(255))

# -------------------- A-Series Forms --------------------
class Form1A(BaseCertificate, PaymentMixin, AvailableMixin):
    __tablename__ = 'form1a'
    __table_args__ = (db.Index("idx_registry_number", "registry_number"),)
    # Child information
    name_child = db.Column(db.String(255), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    date_birth = db.Column(db.Date, nullable=False)
    place_birth = db.Column(db.String(255), nullable=False)
    
    # Parent information
    name_mother = db.Column(db.String(255), nullable=False)
    citizenship_mother = db.Column(db.String(100))
    name_father = db.Column(db.String(255))
    citizenship_father = db.Column(db.String(100))
    
    # Parents' marriage details
    date_marriage_parents = db.Column(db.Date)
    place_marriage_parents = db.Column(db.String(255))

class Form2A(BaseCertificate, PaymentMixin, AvailableMixin):
    __tablename__ = 'form2a'

    # Deceased information
    name_deceased = db.Column(db.String(255), nullable=False)
    sex = db.Column(db.String(10))
    deceased_age = db.Column(db.Integer)
    deceased_civil_status = db.Column(db.String(50))
    deceased_citizenship = db.Column(db.String(100))
    
    # Death details
    date_of_death = db.Column(db.Date, nullable=False)
    place_of_death = db.Column(db.String(255))
    cause_of_death = db.Column(db.String(255))

class Form3A(BaseCertificate, PaymentMixin, AvailableMixin):

    __tablename__ = 'form3a'

    # Groom information
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
    
    # Marriage details
    date_marriage = db.Column(db.Date, nullable=False)
    place_marriage = db.Column(db.String(255))


# -------------------- B-Series Forms -------------------- 
class Form1B(BaseCertificate, PaymentMixin):
    __tablename__ = 'form1b'
    no_record_birth_of = db.Column(db.String(255))
    born_on = db.Column(db.Date)
    mother_name = db.Column(db.String(255))
    father_name = db.Column(db.String(255))
    intact_birth_year = db.Column(db.Integer)

class Form2B(BaseCertificate, PaymentMixin):
    __tablename__ = 'form2b'
    no_record_death_of = db.Column(db.String(255))
    died_on = db.Column(db.Date)
    intact_death_year = db.Column(db.Integer)

class Form3B(BaseCertificate, PaymentMixin):
    __tablename__ = 'form3b'
    no_record_marriage_of = db.Column(db.String(255))
    married_on = db.Column(db.Date)
    intact_marriage_year = db.Column(db.Integer)


# -------------------- C-Series Forms --------------------
class Form1C(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = 'form1c'
    birth_name = db.Column(db.String(255))
    born_on = db.Column(db.Date)

class Form2C(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = 'form2c'
    death_name = db.Column(db.String(255))
    died_on = db.Column(db.Date)

class Form3C(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = 'form3c'
    marriage_name = db.Column(db.String(255))
    married_on = db.Column(db.Date)