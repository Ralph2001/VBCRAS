from flask import Flask
from .extensions import db  # Assuming extensions.py is in a subfolder
from .models import *


def create_app():
    app = Flask(__name__)

    # Configure database connection
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize SQLAlchemy with the app
    db.init_app(app)
    

    with app.app_context():
        db.create_all()

    return app
