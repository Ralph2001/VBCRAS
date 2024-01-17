from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy import Column, DateTime, func


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"

db = SQLAlchemy(app) 
ma = Marshmallow(app)

class ScannedDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    filepath = db.Column(db.String, nullable=False) 
    type = db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class ScannedDocumentsSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('id', 'name', 'filepath', 'type')
    
scan_schema = ScannedDocumentsSchema()
scans_schema = ScannedDocumentsSchema(many=True)

    
@app.route('/scanned', methods=['GET'])
def scanned():
    all_scanned = ScannedDocuments.query.all()
    results = scans_schema.dump(all_scanned)
    return jsonify(results)
    
@app.route('/add_scanned', methods=['POST'])
def add_document():
    data = request.get_json()  
    new_document = ScannedDocuments(**data) 
    db.session.add(new_document)  
    db.session.commit()  
    return jsonify({'status': 'success', 'message': 'Document added successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    CORS(app)
    app.run()
