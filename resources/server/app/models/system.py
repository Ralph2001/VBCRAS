from ..extensions import db, func, DateTime


class SystemSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    municipality_province = db.Column(db.String(420), nullable=False)
    municipal_civil_registrar = db.Column(db.String(420), nullable=False)
    mayor = db.Column(db.String(420), nullable=False)
    reciept_municipality_province = db.Column(db.String(420), nullable=False)
    created_on = db.Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_on = db.Column(DateTime(timezone=True), server_default=func.now(),  onupdate=func.now(),  nullable=False)


