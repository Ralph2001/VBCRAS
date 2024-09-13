from ..extensions import db, func, DateTime


class SystemSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    municipal_civil_registrar = db.Column(db.String(420))
    mayor = db.Column(db.String(420))
    
    # Petition Defaults
    petition_default_file_path = db.Column(db.String(420))
    petition_default_nationality = db.Column(db.String(420))
    petition_default_country = db.Column(db.String(420))
    petition_default_filling_province = db.Column(db.String(420))
    petition_default_filling_municipality = db.Column(db.String(420))
    petition_default_administering_officer_name = db.Column(db.String(420))
    petition_default_administering_officer_position = db.Column(db.String(420))
    petition_default_subscribe_sworn_municipality = db.Column(db.String(420))
    petition_default_issued_at = db.Column(db.String(420))
    petition_always_granted = db.Column(db.Boolean, default=True)
    
    created_on = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_on = db.Column(DateTime(timezone=True), server_default=func.now(),  onupdate=func.now(),  nullable=False)


class DateRules(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type  = db.Column(db.String)
    days_after  = db.Column(db.Integer)
    exclude_holidays_weekends  = db.Column(db.Boolean)
    allow_weekend  = db.Column(db.Boolean)
    allow_holiday  = db.Column(db.Boolean)

class Holidays(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    holiday_date  = db.Column(db.String)
    description  = db.Column(db.String, nullable=True)
