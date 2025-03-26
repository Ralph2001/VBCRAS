import os
import sys

from flask import Flask
from .extensions import db, jwt, ma, CORS, timedelta
from .routes.user import user
from .routes.ausf import ausf
from .routes.config_route import configuration
from .routes.forms import forms
from .routes.scanned import scans
from .routes.petition import petitions
from .routes.application_marriage_license import application_marriage_license

def get_database_path():
  
    if getattr(sys, 'frozen', False):
        base_path = os.path.dirname(sys.executable)
    else:
        base_path = os.path.dirname(__file__)
    return os.path.join(base_path, "vbcras.sqlite3")



def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{get_database_path()}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
    app.config["JWT_SECRET_KEY"] = "VBCRAS_SECRET_KEY_IS_THE_ONE_PIECE_IS_REAL"
    
    # Initialize SQLAlchemy with the app
    jwt.init_app(app)
    db.init_app(app)
    ma.init_app(app)
    CORS(app)
    
    
    # Blueprints

    app.register_blueprint(user)
    app.register_blueprint(ausf)
    app.register_blueprint(configuration)
    app.register_blueprint(scans)
    app.register_blueprint(petitions)
    app.register_blueprint(application_marriage_license)
    app.register_blueprint(forms)
    
    
    # Models
    # Add Models Here to create it
    from .models.scanned import ScannedType, Scans
    from .models.user import Users, create_admin
    from .models.ausf import Ausf
    from .models.system import SystemSettings
    from .models.civil_registry_corrections import Petitions
    from .models.application_marriage_license import ApplicationMarriageLicense
    from .models.form import BirthAvailable, DeathAvailable, MarriageAvailable, BirthIntact, DeathIntact, MarriageIntact, BirthDestroyed, DeathDestroyed, MarriageDestroyed
     
    with app.app_context():
        db.create_all()
        create_admin()

    return app
