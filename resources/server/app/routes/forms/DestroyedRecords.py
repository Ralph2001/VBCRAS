from ...extensions import db, jsonify, request, Blueprint
from ...models.form import  BirthDestroyed, DeathDestroyed, MarriageDestroyed
from ...schemas.forms_schema import  Form1CSchema, Form2CSchema, Form3CSchema

formDestroyedRecords = Blueprint("formDestroyedRecords", __name__)

# SCHEMA
form1c_schema = Form1CSchema()
form1c_list_schema = Form1CSchema(many=True)
form2c_schema = Form2CSchema()
form2c_list_schema = Form2CSchema(many=True)
form3c_schema = Form3CSchema()
form3c_list_schema = Form3CSchema(many=True)

# Routes for BirthDestroyed
@formDestroyedRecords.route("/form1c", methods=["GET"])
def get_all_form1c():
    records = BirthDestroyed.query.all()
    result = form1c_list_schema.dump(records)
    return jsonify(result), 200

@formDestroyedRecords.route("/form1c", methods=["POST"])
def add_form1c():
    data = request.get_json()
    new_record = form1c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1c_schema.dump(new_record)
    return jsonify(result), 201

@formDestroyedRecords.route("/form1c/<int:id>", methods=["GET"])
def get_form1c(id):
    record = BirthDestroyed.query.get_or_404(id)
    result = form1c_schema.dump(record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form1c/<int:id>", methods=["PUT"])
def update_form1c(id):
    record = BirthDestroyed.query.get_or_404(id)
    data = request.get_json()
    updated_record = form1c_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form1c_schema.dump(updated_record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form1c/<int:id>", methods=["DELETE"])
def delete_form1c(id):
    record = BirthDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthDestroyed record deleted successfully."}), 200

# Routes for Death Destroyed
@formDestroyedRecords.route("/form2c", methods=["GET"])
def get_all_form2c():
    records = DeathDestroyed.query.all()
    result = form2c_list_schema.dump(records)
    return jsonify(result), 200

@formDestroyedRecords.route("/form2c", methods=["POST"])
def add_form2c():
    data = request.get_json()
    new_record = form2c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2c_schema.dump(new_record)
    return jsonify(result), 201

@formDestroyedRecords.route("/form2c/<int:id>", methods=["GET"])
def get_form2c(id):
    record = DeathDestroyed.query.get_or_404(id)
    result = form2c_schema.dump(record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form2c/<int:id>", methods=["PUT"])
def update_form2c(id):
    record = BirthDestroyed.query.get_or_404(id)
    data = request.get_json()
    updated_record = form2c_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form2c_schema.dump(updated_record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form2c/<int:id>", methods=["DELETE"])
def delete_form2c(id):
    record = DeathDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathDestroyed record deleted successfully."}), 200

# Routes for MarriageDestroyed
@formDestroyedRecords.route("/form3c", methods=["GET"])
def get_all_form3c():
    records = MarriageDestroyed.query.all()
    result = form3c_list_schema.dump(records)
    return jsonify(result), 200

@formDestroyedRecords.route("/form3c", methods=["POST"])
def add_form3c():
    data = request.get_json()
    new_record = form3c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3c_schema.dump(new_record)
    return jsonify(result), 201

@formDestroyedRecords.route("/form3c/<int:id>", methods=["GET"])
def get_form3c(id):
    record = MarriageDestroyed.query.get_or_404(id)
    result = form3c_schema.dump(record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form3c/<int:id>", methods=["PUT"])
def update_form3c(id):
    record = BirthDestroyed.query.get_or_404(id)
    data = request.get_json()
    updated_record = form3c_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form3c_schema.dump(updated_record)
    return jsonify(result), 200

@formDestroyedRecords.route("/form3c/<int:id>", methods=["DELETE"])
def delete_form3c(id):
    record = MarriageDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageDestroyed record deleted successfully."}), 200