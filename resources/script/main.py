from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import class_mapper
from werkzeug.exceptions import NotFound

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "createdbyralph"  
jwt = JWTManager(app)
db = SQLAlchemy(app) 

class ScannedDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


try:
    with app.app_context():
        db.create_all()
        db.session.execute(db.select(ScannedDocuments).order_by(ScannedDocuments.name)).scalars()
except Exception as e:
    print(f"Error connecting to the database: {str(e)}")
    exit(1)
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Invalid request'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(user.id)  
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

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

    token = create_access_token(new_user.id)  
    return jsonify({'token': token}), 201

   
   
@app.route('/scanned', methods=['GET', 'POST'])
@jwt_required()
def scanned():
    
    current_user = get_jwt_identity()
    scans = db.session.execute(db.select(ScannedDocuments).order_by(ScannedDocuments.id)).scalars()
    scans_list = []
    
    for scan in scans:
        mapped_scan = {column.key: getattr(scan, column.key) for column in class_mapper(ScannedDocuments).columns}
        scans_list.append(mapped_scan)
    
    return jsonify({
        'message': 'success',
        'scans': scans_list,
        'login_as': current_user
    })
    

@app.route('/scanned/add', methods=['POST'])
@jwt_required()
def add():
    data = request.json

    if not data or not all(field in data for field in ['name', 'filepath', 'type']):
        return jsonify({'message': 'Missing Required Fields', 'status': 'required'}), 400
  
    
    new_document = ScannedDocuments(**data)
    db.session.add(new_document)
    db.session.commit()

    return jsonify({'message': 'Document added successfully', 'status': 'success'}), 201




@app.route("/scanned/delete/<int:id>", methods=['DELETE'])
@jwt_required()
def remove_scanned(id):
    try:
        scanned = db.get_or_404(ScannedDocuments, id)
        db.session.delete(scanned)
        db.session.commit()
        return jsonify({'message': 'Document removed successfully', 'status': 'Success'}), 201
    except NotFound:
        return jsonify({'message': 'Document not found', 'status': 'Error'}), 404

    
    
if __name__ == '__main__':

    CORS(app)
    app.run(host="0.0.0.0", port=1216, debug=True)
