import os
import sys

from flask import Flask
from .extensions import db, jwt, ma, CORS, timedelta
from .routes.user import user
from .routes.ausf import ausf
from .routes.config_route import configuration

# from .routes.forms import forms
from .routes.forms.AvailableRecords import formAvailableRoute
from .routes.forms.IntactRecords import formItactRecords
from .routes.forms.DestroyedRecords import formDestroyedRecords

from .routes.scanned import scans
from .routes.petition import petitions
from .routes.application_marriage_license import application_marriage_license


from .routes.log import activity_bp
from .extensions import migrate

from pathlib import Path

def get_database_path():
    # Get a user-safe writable path like %APPDATA% or ~/.config
    if os.name == "nt":
        user_data_dir = Path(os.getenv("APPDATA")) / "VBCRAS"
    else:
        user_data_dir = Path.home() / ".config" / "VBCRAS"
    
    user_data_dir.mkdir(parents=True, exist_ok=True)
    db_path = user_data_dir / "vbcras.sqlite3"

    # If DB does not exist, copy it from bundled resources (1st run only)
    if not db_path.exists() and getattr(sys, 'frozen', False):
        # Assuming the template DB is bundled in the same folder as the EXE
        bundled_path = Path(sys.executable).parent / "vbcras.sqlite3"
        if bundled_path.exists():
            import shutil
            shutil.copy(bundled_path, db_path)

    return str(db_path)



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
    migrate.init_app(app, db)
    CORS(app)
    
    
    # Blueprints

    app.register_blueprint(user)
    app.register_blueprint(ausf)
    app.register_blueprint(configuration)
    app.register_blueprint(scans)
    app.register_blueprint(petitions)
    app.register_blueprint(application_marriage_license)
    
    #  Register Forms Routes
    app.register_blueprint(formAvailableRoute)
    app.register_blueprint(formItactRecords)
    app.register_blueprint(formDestroyedRecords)

    #Activity Logs Blueprint

    app.register_blueprint(activity_bp)
    
    
    # Models
    # Add Models Here to create it
    from .models.scanned import ScannedType, Scans
    from .models.user import Users, create_admin
    from .models.ausf import Ausf
    from .models.system import SystemSettings
    from .models.civil_registry_corrections import Petitions
    from .models.application_marriage_license import ApplicationMarriageLicense
    from .models.form import BirthAvailable, DeathAvailable, MarriageAvailable, BirthIntact, DeathIntact, MarriageIntact, BirthDestroyed, DeathDestroyed, MarriageDestroyed
    from .models.logs import ActivityLog


    with app.app_context():
        db.create_all()
        create_admin()

    return app
