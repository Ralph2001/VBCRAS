from ..extensions import db


class BaseCertificate(db.Model):
    __abstract__ = True  # Abstract base class won't create a table

    # All Forms have this
    id = db.Column(db.Integer, primary_key=True)
    date_filed = db.Column(db.String(50))
    certification_issued_to = db.Column(db.String(255))
    verified_by = db.Column(db.String(255))
    verifier_position = db.Column(db.String(255))
    civil_registrar = db.Column(db.String(255))
    civil_registrar_position = db.Column(db.String(255))
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    is_with_authentication = db.Column(db.Boolean, default=False)
    for_and_in_the_absence = db.Column(db.Boolean, default=False)
    absence_verified_by = db.Column(db.String(255))
    absence_verifier_position = db.Column(db.String(255))
    form_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(455), nullable=False)


class AvailableMixin:
    """Fields for forms with available records"""

    date_registration = db.Column(db.String(50))
    page_number = db.Column(db.String(20))
    book_number = db.Column(db.String(20))
    registry_number = db.Column(db.String(50))
    remarks = db.Column(db.Text)
    is_reconstructed = db.Column(db.Boolean, default=False)
    is_other_remarks = db.Column(db.Boolean, default=False)


class PaymentMixin:
    """Payment-related fields for forms with financial transactions"""

    amount_paid = db.Column(db.String(50))
    or_number = db.Column(db.String(50))
    date_paid = db.Column(db.String(50))


class RegisteredPeriodMixin:
    """Fields for forms tracking registration periods"""

    registered_from = db.Column(db.String(255))
    from_year = db.Column(db.String(155))
    to_year = db.Column(db.String(155))
    destroyed_by = db.Column(db.String(255))


# -------------------- A-Series Forms --------------------
class BirthAvailable(BaseCertificate, PaymentMixin, AvailableMixin):
    __tablename__ = "birth_available"
    __table_args__ = (db.Index("idx_registry_number", "registry_number"),)
    # Child information
    name_child = db.Column(db.String(255), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    date_birth = db.Column(db.String(100), nullable=False)
    place_birth = db.Column(db.String(255), nullable=False)

    # Parent information
    name_mother = db.Column(db.String(255), nullable=False)
    citizenship_mother = db.Column(db.String(100))
    name_father = db.Column(db.String(255))
    citizenship_father = db.Column(db.String(100))

    # Parents' marriage details
    date_marriage_parents = db.Column(db.String(100))
    place_marriage_parents = db.Column(db.String(255))


class DeathAvailable(BaseCertificate, PaymentMixin, AvailableMixin):
    __tablename__ = "death_available"

    # Deceased information
    name_deceased = db.Column(db.String(255), nullable=False)
    sex = db.Column(db.String(10))
    deceased_age = db.Column(db.String(50))
    deceased_civil_status = db.Column(db.String(50))
    deceased_citizenship = db.Column(db.String(100))

    # Death details
    date_of_death = db.Column(db.String(120), nullable=False)
    place_of_death = db.Column(db.String(255))
    cause_of_death = db.Column(db.String(255))


class MarriageAvailable(BaseCertificate, PaymentMixin, AvailableMixin):

    __tablename__ = "marriage_available"

    # Groom information
    groom_name = db.Column(db.String(255), nullable=False)
    groom_date_birth = db.Column(db.String(100))
    groom_age = db.Column(db.String(155))
    groom_citizenship = db.Column(db.String(100))
    groom_civil_status = db.Column(db.String(50))
    groom_mother = db.Column(db.String(255))
    groom_father = db.Column(db.String(255))

    # Bride information
    bride_name = db.Column(db.String(255), nullable=False)
    bride_date_birth = db.Column(db.String(100))
    bride_age = db.Column(db.String(155))
    bride_citizenship = db.Column(db.String(100))
    bride_civil_status = db.Column(db.String(50))
    bride_mother = db.Column(db.String(255))
    bride_father = db.Column(db.String(255))

    # Marriage details
    date_marriage = db.Column(db.String(100), nullable=False)
    place_marriage = db.Column(db.String(255))


# -------------------- B-Series Forms --------------------
class BirthIntact(BaseCertificate, PaymentMixin):
    __tablename__ = "birth_intact"
    no_record_birth_of = db.Column(db.String(255))
    born_on = db.Column(db.String(155))
    mother_name = db.Column(db.String(255))
    father_name = db.Column(db.String(255))
    intact_birth_year = db.Column(db.String(155))


class DeathIntact(BaseCertificate, PaymentMixin):
    __tablename__ = "death_intact"
    no_record_death_of = db.Column(db.String(255))
    died_on = db.Column(db.String(155))
    intact_death_year = db.Column(db.String(155))


class MarriageIntact(BaseCertificate, PaymentMixin):
    __tablename__ = "marriage_intact"
    no_record_marriage_of = db.Column(db.String(255))
    married_with = db.Column(db.String(255))
    married_on = db.Column(db.String(155))
    intact_marriage_year = db.Column(db.String(155))


# -------------------- C-Series Forms --------------------
class BirthDestroyed(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = "birth_destroyed"
    birth_name = db.Column(db.String(255))
    born_on = db.Column(db.String(155))
    mother_name = db.Column(db.String(255))
    father_name = db.Column(db.String(255))


class DeathDestroyed(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = "death_destroyed"
    death_name = db.Column(db.String(255))
    died_on = db.Column(db.String(155))


class MarriageDestroyed(BaseCertificate, PaymentMixin, RegisteredPeriodMixin):
    __tablename__ = "marriage_destroyed"
    groom_name = db.Column(db.String(255))
    bride_name = db.Column(db.String(255))
    married_on = db.Column(db.String(155))
