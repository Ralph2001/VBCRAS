from ..extensions import db, func, DateTime


class SystemSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    province = db.Column(db.String(255))
    municipality = db.Column(db.String(255))
    civil_registrar = db.Column(db.String(255))
    mayor = db.Column(db.String(255))
    file_path = db.Column(db.String(455))

    
    created_on = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_on = db.Column(DateTime(timezone=True), server_default=func.now(),  onupdate=func.now(),  nullable=False)
class DateRules(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    # Notice
    notice_day  = db.Column(db.Integer)
    include_holidays_notice_day = db.Column(db.Boolean)
    include_weekends_notice_day = db.Column(db.Boolean)
    allow_weekend_end_notice_day = db.Column(db.Boolean)
    allow_holiday_end_notice_day = db.Column(db.Boolean)

    # Certificate Start
    certificate_start = db.Column(db.Integer)
    include_holidays_certificate_start = db.Column(db.Boolean)
    include_weekends_certificate_start = db.Column(db.Boolean)
    allow_weekend_certificate_start = db.Column(db.Boolean)
    allow_holiday_certificate_start = db.Column(db.Boolean)

    # Certificate End
    certificate_end = db.Column(db.Integer)
    include_holidays_certificate_end = db.Column(db.Boolean)
    include_weekends_certificate_end = db.Column(db.Boolean)
    allow_weekend_certificate_end = db.Column(db.Boolean)
    allow_holiday_certificate_end = db.Column(db.Boolean)

    # Issuance
    date_issued = db.Column(db.Integer)
    include_holidays_date_issued = db.Column(db.Boolean)
    include_weekends_date_issued = db.Column(db.Boolean)
    allow_weekend_date_issued = db.Column(db.Boolean)
    allow_holiday_date_issued = db.Column(db.Boolean)

    # Grant
    date_granted  = db.Column(db.Integer)
    include_holidays_date_granted = db.Column(db.Boolean)
    include_weekends_date_granted = db.Column(db.Boolean)
    allow_weekend_date_granted = db.Column(db.Boolean)
    allow_holiday_date_granted  = db.Column(db.Boolean)


class Holidays(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    holiday_date  = db.Column(db.String)
    description  = db.Column(db.String, nullable=True)
