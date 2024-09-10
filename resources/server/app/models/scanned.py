from ..extensions import db


class ScannedType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    
class Scans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('scanned_type.id'), nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    device_used = db.Column(db.String, nullable=True)
    
    scanned_type = db.relationship(ScannedType, backref='scans', lazy=True)