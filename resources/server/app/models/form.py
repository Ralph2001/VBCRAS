from ..extensions import db

class Forms(db.Model):
    __tablename__ = 'forms'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    date_filed = db.Column(db.Date, nullable=False)
    page_number = db.Column(db.String(10), nullable=False)
    book_number = db.Column(db.String(10), nullable=False)
    registry_number = db.Column(db.String(20), nullable=False)
    date_registration = db.Column(db.Date, nullable=False)
    issued_to = db.Column(db.String(100), nullable=False)
    mcr = db.Column(db.String(50), nullable=False)
    verified_by = db.Column(db.String(50), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    or_number = db.Column(db.String(20), nullable=False)
    date_paid = db.Column(db.Date, nullable=False)
    is_authenticated = db.Column(db.Boolean, nullable=False, default=False)
    remarks = db.Column(db.Text, nullable=True)


    # Relationships
    birth_records = db.relationship('BirthAvailable', backref='form', lazy=True)
    death_records = db.relationship('DeathAvailable', backref='form', lazy=True)
    marriage_records = db.relationship('MarriageAvailable', backref='form', lazy=True)

class BirthAvailable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_child = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    date_birth = db.Column(db.Date, nullable=False)
    place_birth = db.Column(db.String(100), nullable=False)
    name_mother = db.Column(db.String(100), nullable=False)
    citizenship_mother = db.Column(db.String(50), nullable=False)
    name_father = db.Column(db.String(100), nullable=False)
    citizenship_father = db.Column(db.String(50), nullable=False)
    date_marriage_parents = db.Column(db.Date, nullable=False)
    place_marriage_parents = db.Column(db.String(100), nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

class DeathAvailable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_deceased = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    civil_status = db.Column(db.String(50), nullable=False)
    citizenship = db.Column(db.String(50), nullable=False)
    date_death = db.Column(db.Date, nullable=False)
    place_death = db.Column(db.String(100), nullable=False)
    cause_death = db.Column(db.Text, nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

class MarriageAvailable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_husband = db.Column(db.String(100), nullable=False)
    name_wife = db.Column(db.String(100), nullable=False)
    date_birth_husband = db.Column(db.Date, nullable=False)
    date_birth_wife = db.Column(db.Date, nullable=False)
    age_husband = db.Column(db.Integer, nullable=False)
    age_wife = db.Column(db.Integer, nullable=False)
    citizenship_husband = db.Column(db.String(50), nullable=False)
    citizenship_wife = db.Column(db.String(50), nullable=False)
    civil_status_husband = db.Column(db.String(50), nullable=False)
    civil_status_wife = db.Column(db.String(50), nullable=False)
    husband_mother = db.Column(db.String(100), nullable=False)
    wife_mother = db.Column(db.String(100), nullable=False)
    husband_father = db.Column(db.String(100), nullable=False)
    wife_father = db.Column(db.String(100), nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)