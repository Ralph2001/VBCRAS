from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import class_mapper

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app) 

class ScannedDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

try:
    with app.app_context():
        db.create_all()
        db.session.execute(db.select(ScannedDocuments).order_by(ScannedDocuments.name)).scalars()
except Exception as e:
    print(f"Error connecting to the database: {str(e)}")
    exit(1)
    
@app.route('/scanned', methods=['GET', 'POST'])
def scanned():
    scans = db.session.execute(db.select(ScannedDocuments).order_by(ScannedDocuments.id)).scalars()
    scans_list = []
    
    for scan in scans:
        mapped_scan = {column.key: getattr(scan, column.key) for column in class_mapper(ScannedDocuments).columns}
        scans_list.append(mapped_scan)
    
    return jsonify({
        'message': 'success',
        'scans': scans_list
    })

@app.route('/add', methods=['POST'])
def add():
    data = request.json

    if not data or not all(field in data for field in ['name', 'filepath', 'type']):
        return jsonify({'error': 'Missing required fields'}), 400

    new_document = ScannedDocuments(**data)
    db.session.add(new_document)
    db.session.commit()

    return jsonify({'message': 'Document added successfully', 'document': new_document.to_dict()}), 201

    

if __name__ == '__main__':

    CORS(app)
    app.run(host="localhost", port=1216)
