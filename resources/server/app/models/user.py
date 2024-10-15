from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import IntegrityError
from .ausf import Ausf
from .scanned import Scans
from .civil_registry_corrections import Petitions


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    # position = db.Column(db.Integer, db.ForeignKey("positions.id"), nullable=True)
    position = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Integer, nullable=False, default=2)
    
    # Relationship
    ausf = db.relationship(Ausf, backref='users', lazy=True)
    scans = db.relationship(Scans, backref='users', lazy=True)
    petitions = db.relationship(Petitions, backref='users', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class IsAdminCreated(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_created = db.Column(db.Boolean, default=False, unique=True)


###############
# Create Admin
###############


def create_admin():
    if not IsAdminCreated.query.first():
        existing_admin = Users.query.filter_by(username="Admin").first()
        if existing_admin:
            return

        try:
            admin = Users(
                username="Admin",
                role=1,
            )
            admin.set_password("123")  # First Main Password

            db.session.add(admin)
            db.session.add(IsAdminCreated(is_created=True))
            db.session.commit()

        except IntegrityError:
            db.session.rollback()  # Rollback in case of an error
        except Exception as e:
            db.session.rollback()
