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
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    uploaded_by = db.Column(db.String, nullable=False)
    device_used =  db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
class RestoreDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.String, nullable=False)
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
    username = db.Column(db.String(400), unique=True, nullable=False)
    position = db.Column(db.String(400), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    permissions = db.relationship('UserPermissions', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  # Use a secure hashing library

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  # Use a secure hashing library

class UserPermissions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    scanned = db.Column(db.Boolean, default=True)
    scanned_view = db.Column(db.Boolean, default=True)
    scanned_add = db.Column(db.Boolean, default=False)
    scanned_delete = db.Column(db.Boolean, default=False)
    
    
    

class AdminCreated(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.Boolean, default=False, unique=True)  

def create_admin_user():
     if not AdminCreated.query.first():
        admin = User(
            username='admin',
            position= 'Admin',
            is_admin=True,
            permissions=[
            UserPermissions(
                scanned=True, 
                scanned_view=True,
                scanned_add = True,
                scanned_delete = True
                ),  
        ]
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
    current_user = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user)).scalar_one()
    permissions = db.session.execute(db.select(UserPermissions).filter_by(user_id=current_user)).scalar_one()
    
    serialized_user = {
        'username': user.username,
        'is_admin': user.is_admin,
        'permissions': {
            'scanned': permissions.scanned,
            'scanned_add': permissions.scanned_add,
            'scanned_view': permissions.scanned_view,
            'scanned_delete': permissions.scanned_delete,
        }
    }
    return jsonify(serialized_user)

    
@app.route('/users', methods=['GET', 'POST'])
@jwt_required()
def users():

    users = User.query.filter_by(is_admin=False).all()
    users_list = []

    for user in users:
        data = {
            "id" : user.id,
            "name": user.username,
            "is_admin": user.is_admin,
        }
        users_list.append(data)

    return jsonify({
        'message': 'success',
        'users': users_list,
    })



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()


    if not data or not all(field in data for field in ['username', 'password', 'position']):
        return jsonify({'error': 'Missing required fields: username, password, and position'}), 400


    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 409

 
    new_user = User(
        username=data['username'],
        position=data['position'],
        permissions=[
            UserPermissions(scanned=True),  
          
        ]
    )
    new_user.set_password(data['password'])


    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
    
        return jsonify({'error': 'Database integrity error: ' + str(e)}), 409

    return jsonify({'status': 'success'}), 201
1

   
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

@app.route('/scanned/log/add', methods=['GET', 'POST'])
@jwt_required()
def scanned_log_add():
    try:
            data = request.get_json()
            
            for item in data:
                document_log = DocumentsLog(
                    name=item['name'],
                    action=item['action'],
                    action_by=current_user.username,
                    device_used=item['device_used']
                )
                db.session.add(document_log)
            db.session.commit()
            return jsonify({'message': 'Documents added successfully', 'status': 'success'}), 201
    except Exception as e:
            return jsonify({'message': 'Error Adding Log', 'status': 'error'}), 500


@app.route('/scanned/log/view', methods=['GET', 'POST'])
@jwt_required()
def scanned_log_list():
    
        scanned_logs = db.session.execute(db.select(DocumentsLog).order_by(DocumentsLog.id)).scalars()
        scanned_list = []
        
        for scan in scanned_logs:
            mapped_scan = {column.key: getattr(scan, column.key) for column in class_mapper(DocumentsLog).columns}
            scanned_list.append(mapped_scan)
        
        return jsonify({
            'message': 'success',
            'scans': scanned_list,
        })

@app.route('/scanned/add', methods=['POST'])
@jwt_required()
def add():
    try:
       
        data = request.get_json()
      
      
        for item in data:
            if not all(field in item for field in ['name', 'filepath', 'type', 'year', 'uploaded_by', 'device_used']):
                return jsonify({'message': 'Missing required field in object', 'status': 'required'}), 400
           
            existing_document = ScannedDocuments.query.filter_by(filepath=item['filepath']).first()
            if existing_document:
                    return jsonify({'message': f"Data already exists: {item['name']}", 'status': 'duplicate'}), 409  
            new_document = ScannedDocuments(**item)
            db.session.add(new_document)
        
        db.session.commit()
        return jsonify({'message': 'Documents added successfully', 'status': 'success'}), 201
    except Exception as e:
        return jsonify({'message': 'Something went wrong.', 'status': 'error'}), 500



@app.route("/scanned/delete/<int:id>&<string:device_used_to_delete>", methods=['DELETE'])
@jwt_required()
def remove_scanned(id, device_used_to_delete):
    try:
        scanned = ScannedDocuments.query.get(id) 

        restored_doc = RestoreDocuments(
            name=scanned.name,
            filepath=scanned.filepath,
            month=scanned.month,
            year=scanned.year,
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
