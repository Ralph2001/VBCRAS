from flask import Flask
from .extensions import db, jwt, ma, CORS, timedelta
from .routes.user import user
from .routes.ausf import ausf
from .routes.config_route import configuration
from .routes.scanned import scans



def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///vbcras.sqlite3"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
    app.config["JWT_SECRET_KEY"] = "VBCRAS_SECRET_KEY_IS_SECRET"
    
    
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
    
    
    
    # Models
    from .models.scanned import ScannedType, Scans
    from .models.user import Users, create_admin
    from .models.form import Forms, BirthAvailable, DeathAvailable, MarriageAvailable   
    from .models.ausf import Ausf
    from .models.system import SystemSettings
    
     
    with app.app_context():
        db.create_all()
        create_admin()

    return app
