from ..extensions import db
from datetime import datetime

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now, index=True)

    # Foreign key to Users table
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    users = db.relationship("Users", backref="activity_logs")

    action = db.Column(db.String(32), nullable=False, index=True)
    module = db.Column(db.String(64), nullable=False, index=True)
    details = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(16), nullable=False, index=True)

    def __repr__(self):
        return f"<ActivityLog {self.timestamp} - UserID {self.created_by} - {self.action}>"
