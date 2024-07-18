from ..extensions import db
from .user import Users  # Assuming users.py is in the same directory


class ScannedType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)


class Scans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("scanned_type.id"), nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    device_used = db.Column(db.String, nullable=False)
    
    uploaded_user = db.relationship(Users, backref='scans')