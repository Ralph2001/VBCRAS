from ..extensions import db

class Positions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(420), unique=True, nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    position = db.Column(db.Integer, db.ForeignKey("positions.id"), nullable=True)
    password = db.Column(db.String(120), nullable=False)
