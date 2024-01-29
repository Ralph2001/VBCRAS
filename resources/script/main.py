from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import class_mapper
from werkzeug.exceptions import NotFound

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
    

@app.route('/scanned/add', methods=['POST'])
def add():
    data = request.json

    if not data or not all(field in data for field in ['name', 'filepath', 'type']):
        return jsonify({'message': 'Missing Required Fields', 'status': 'required'}), 400
  
    
    new_document = ScannedDocuments(**data)
    db.session.add(new_document)
    db.session.commit()

    return jsonify({'message': 'Document added successfully', 'status': 'success'}), 201




@app.route("/scanned/delete/<int:id>", methods=['DELETE'])
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
