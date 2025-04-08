from ...extensions import db, jsonify, request, Blueprint
from ...models.form import  BirthIntact, DeathIntact, MarriageIntact
from ...schemas.forms_schema import  Form1BSchema, Form2BSchema, Form3BSchema


formItactRecords = Blueprint("formItactRecords", __name__)

form1b_schema = Form1BSchema()
form1b_list_schema = Form1BSchema(many=True)
form2b_schema = Form2BSchema()
form2b_list_schema = Form2BSchema(many=True)
form3b_schema = Form3BSchema()
form3b_list_schema = Form3BSchema(many=True)



# Routes for Birth Intact
@formItactRecords.route("/form1b", methods=["GET"])
def get_all_form1b():
    records = BirthIntact.query.all()
    result = form1b_list_schema.dump(records)
    return jsonify(result), 200

@formItactRecords.route("/form1b", methods=["POST"])
def add_form1b():
    data = request.get_json()
    new_record = form1b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1b_schema.dump(new_record)
    return jsonify(result), 201

@formItactRecords.route("/form1b/<int:id>", methods=["GET"])
def get_form1b(id):
    record = BirthIntact.query.get_or_404(id)
    result = form1b_schema.dump(record)
    return jsonify(result), 200

@formItactRecords.route("/form1b/<int:id>", methods=["PUT"])
def update_form1b(id):
    record = BirthIntact.query.get_or_404(id)
    data = request.get_json()
    updated_record = form1b_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form1b_schema.dump(updated_record)
    return jsonify(result), 200

@formItactRecords.route("/form1b/<int:id>", methods=["DELETE"])
def delete_form1b(id):
    record = BirthIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthIntact record deleted successfully."}), 200




# Routes for Death Intact
@formItactRecords.route("/form2b", methods=["GET"])
def get_all_form2b():
    records = DeathIntact.query.all()
    result = form2b_list_schema.dump(records)
    return jsonify(result), 200

@formItactRecords.route("/form2b", methods=["POST"])
def add_form2b():
    data = request.get_json()
    new_record = form2b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2b_schema.dump(new_record)
    return jsonify(result), 201

@formItactRecords.route("/form2b/<int:id>", methods=["GET"])
def get_form2b(id):
    record = DeathIntact.query.get_or_404(id)
    result = form2b_schema.dump(record)
    return jsonify(result), 200

@formItactRecords.route("/form2b/<int:id>", methods=["PUT"])
def update_form2b(id):
    record = BirthIntact.query.get_or_404(id)
    data = request.get_json()
    updated_record = form2b_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form2b_schema.dump(updated_record)
    return jsonify(result), 200

@formItactRecords.route("/form2b/<int:id>", methods=["DELETE"])
def delete_form2b(id):
    record = DeathIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathIntact record deleted successfully."}), 200

# Routes for Marriage Intact
@formItactRecords.route("/form3b", methods=["GET"])
def get_all_form3b():
    records = MarriageIntact.query.all()
    result = form3b_list_schema.dump(records)
    return jsonify(result), 200

@formItactRecords.route("/form3b", methods=["POST"])
def add_form3b():
    data = request.get_json()
    new_record = form3b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3b_schema.dump(new_record)
    return jsonify(result), 201

@formItactRecords.route("/form3b/<int:id>", methods=["GET"])
def get_form3b(id):
    record = MarriageIntact.query.get_or_404(id)
    result = form3b_schema.dump(record)
    return jsonify(result), 200

@formItactRecords.route("/form3b/<int:id>", methods=["PUT"])
def update_form3b(id):
    record = BirthIntact.query.get_or_404(id)
    data = request.get_json()
    updated_record = form3b_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form3b_schema.dump(updated_record)
    return jsonify(result), 200

@formItactRecords.route("/form3b/<int:id>", methods=["DELETE"])
def delete_form3b(id):
    record = MarriageIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageIntact record deleted successfully."}), 200
