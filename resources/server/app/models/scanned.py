from ..extensions import db


class ScannedType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    
class Scans(db.Model):
    
    __table_args__ = (
        db.Index('idx_scans_type_year_month', 'type_id', 'year', 'month'),  
        db.Index('idx_scans_year', 'year'),
        db.Index('idx_scans_month', 'month')
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('scanned_type.id'), nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    scanned_type = db.relationship(ScannedType, backref='scans', lazy=True)