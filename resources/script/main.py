from datetime import timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import class_mapper
from werkzeug.exceptions import NotFound

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from werkzeug.security import generate_password_hash, check_password_hash
import signal


app = Flask(__name__)

def handle_sigterm(sig, frame):
    print("Received SIGTERM, shutting down Flask server...")
    exit(0)  

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config["JWT_SECRET_KEY"] = "created_by_villanuevaralph2001@gmail.com"  
jwt = JWTManager(app)
db = SQLAlchemy(app) 

class ScannedDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    year = db.Column(db.String, nullable=False)
    uploaded_by = db.Column(db.String, nullable=False)
    device_used =  db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
class RestoreDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    device_used =  db.Column(db.String, nullable=False)
    deleted_by = db.Column(db.String, nullable=False)
    device_used_to_delete =  db.Column(db.String, nullable=False)
    deleted_at = Column(DateTime, default=func.now())
    
class DocumentsLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String,  nullable=False)
    action = db.Column(db.String, nullable=False)
    action_by = db.Column(db.String, nullable=False)
    device_used =  db.Column(db.String, nullable=False)
    action_at = Column(DateTime, default=func.now())

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
     self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class AdminCreated(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.Boolean, default=False, unique=True)  

def create_admin_user():
     if not AdminCreated.query.first():
        admin = User(
            username='admin', 
            is_admin=True
        )
        admin.set_password('admin')
        
        db.session.add(admin)
        db.session.add(AdminCreated(created=True))
        db.session.commit()
        
with app.app_context():
    db.create_all()
    create_admin_user() 
        
        

    
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Invalid request'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user)  
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401




@app.route("/connect", methods=["GET"])
def connect():
    return jsonify({'status': 'connected'}), 201

@app.route("/user", methods=["GET"])
@jwt_required()
def protected():
    return jsonify(
        id=current_user.id,
        username=current_user.username,
        id_admin = current_user.is_admin
    )


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Invalid request'}), 400

    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 409

    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status': 'success'}), 201

   
@app.route('/scanned', methods=['GET', 'POST'])
@jwt_required()
def scanned():

        scans = db.session.execute(db.select(ScannedDocuments).order_by(ScannedDocuments.id)).scalars()
        scans_list = []
        
        for scan in scans:
            mapped_scan = {column.key: getattr(scan, column.key) for column in class_mapper(ScannedDocuments).columns}
            scans_list.append(mapped_scan)
        
        return jsonify({
            'message': 'success',
            'scans': scans_list,
        })

    

@app.route('/scanned/add', methods=['POST'])
@jwt_required()
def add():
    try:
        # Access the entire data array instead of just the first element
        data = request.get_json()

        # Validate and process each object in the array
        for item in data:
            if not all(field in item for field in ['name', 'filepath', 'type', 'year', 'uploaded_by', 'device_used']):
                return jsonify({'message': 'Missing required field in object', 'status': 'required'}), 400

            # Create a new document for each item
            new_document = ScannedDocuments(**item)
            db.session.add(new_document)

        # Commit changes to the database once all items are processed
        db.session.commit()

        return jsonify({'message': 'Documents added successfully', 'status': 'success'}), 201

    except Exception as e:
        # Handle errors gracefully
        return jsonify({'message': 'Something went wrong.', 'status': 'error'}), 500





@app.route("/scanned/delete/<int:id>&<string:device_used_to_delete>", methods=['DELETE'])
@jwt_required()
def remove_scanned(id, device_used_to_delete):
    try:
        scanned = ScannedDocuments.query.get(id) 

        restored_doc = RestoreDocuments(
            name=scanned.name,
            filepath=scanned.filepath,
            type=scanned.type,
            device_used=scanned.device_used,
            deleted_by=current_user.username,
            device_used_to_delete=device_used_to_delete
        )
        document_log = DocumentsLog(
            name = scanned.name,
            action = "Deleted",
            action_by =current_user.username,
            device_used =device_used_to_delete
        )
        db.session.add(restored_doc)  
        db.session.add(document_log)  
        db.session.delete(scanned)   
        db.session.commit()

        return jsonify({'message': 'Document moved to RestoreDocuments', 'status': 'Success'}), 201

    except NotFound:
        return jsonify({'message': 'Document not found', 'status': 'Error'}), 404


    
    
if __name__ == '__main__':
    signal.signal(signal.SIGTERM, handle_sigterm)
    CORS(app)
    app.run(host="0.0.0.0", port=1216)
