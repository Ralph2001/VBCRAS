from ..extensions import db


class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event = db.Column(db.String(100), nullable=False)
    event_time = db.Column(db.DateTime, default=datetime.utcnow)
    device_used = db.Column(db.String(200))
    action_by = db.Column(db.String(50), nullable=False)
    event_description = db.Column(db.Text)