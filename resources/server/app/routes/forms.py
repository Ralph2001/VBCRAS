from ..extensions import db, jsonify, request, Blueprint
from ..models.form import BirthAvailable, DeathAvailable, MarriageAvailable, BirthIntact, DeathIntact, MarriageIntact, BirthDestroyed, DeathDestroyed, MarriageDestroyed
from ..schemas.forms_schema import Form1ASchema, Form2ASchema, Form3ASchema, Form1BSchema, Form2BSchema, Form3BSchema, Form1CSchema, Form2CSchema, Form3CSchema

forms = Blueprint("forms", __name__)

# Schema Initialize
form1a_schema = Form1ASchema()
form1a_list_schema = Form1ASchema(many=True)
form2a_schema = Form2ASchema()
form2a_list_schema = Form2ASchema(many=True)
form3a_schema = Form3ASchema()
form3a_list_schema = Form3ASchema(many=True)
form1b_schema = Form1BSchema()
form1b_list_schema = Form1BSchema(many=True)
form2b_schema = Form2BSchema()
form2b_list_schema = Form2BSchema(many=True)
form3b_schema = Form3BSchema()
form3b_list_schema = Form3BSchema(many=True)
form1c_schema = Form1CSchema()
form1c_list_schema = Form1CSchema(many=True)
form2c_schema = Form2CSchema()
form2c_list_schema = Form2CSchema(many=True)
form3c_schema = Form3CSchema()
form3c_list_schema = Form3CSchema(many=True)

# Routes for BirthAvailable
@forms.route("/form1a", methods=["GET"])
def get_all_form1a():
    records = BirthAvailable.query.all()
    result = form1a_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form1a", methods=["POST"])
def add_form1a():
    data = request.get_json()
    new_record = form1a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1a_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form1a/<int:id>", methods=["GET"])
def get_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    result = form1a_schema.dump(record)
    return jsonify(result), 200


@forms.route("/form1a/<int:id>", methods=["PUT"])
def update_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    data = request.get_json()
  
    # Update the fields of the record
    updated_record = form1a_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form1a_schema.dump(updated_record)
    return jsonify(result), 200


@forms.route("/form1a/<int:id>", methods=["DELETE"])
def delete_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthAvailable record deleted successfully."}), 200

# Repeat similar routes for DeathAvailable, MarriageAvailable, BirthIntact, DeathIntact, MarriageIntact, BirthDestroyed, DeathDestroyed, MarriageDestroyed

# Example for DeathAvailable
@forms.route("/form2a", methods=["GET"])
def get_all_form2a():
    records = DeathAvailable.query.all()
    result = form2a_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form2a", methods=["POST"])
def add_form2a():
    data = request.get_json()
    new_record = form2a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2a_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form2a/<int:id>", methods=["GET"])
def get_form2a(id):
    record = DeathAvailable.query.get_or_404(id)
    result = form2a_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2a/<int:id>", methods=["DELETE"])
def delete_form2a(id):
    record = DeathAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathAvailable record deleted successfully."}), 200

# 3A Routes

# Add the following routes for MarriageAvailable

@forms.route("/form3a", methods=["GET"])
def get_all_form3a():
    records = MarriageAvailable.query.all()
    result = form3a_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form3a", methods=["POST"])
def add_form3a():
    data = request.get_json()
    new_record = form3a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3a_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form3a/<int:id>", methods=["GET"])
def get_form3a(id):
    record = MarriageAvailable.query.get_or_404(id)
    result = form3a_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3a/<int:id>", methods=["DELETE"])
def delete_form3a(id):
    record = MarriageAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageAvailable record deleted successfully."}), 200


# -------------------------- Routes --------------------------------------------------------------------------------------------


# Routes for BirthIntact
@forms.route("/form1b", methods=["GET"])
def get_all_form1b():
    records = BirthIntact.query.all()
    result = form1b_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form1b", methods=["POST"])
def add_form1b():
    data = request.get_json()
    new_record = form1b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1b_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form1b/<int:id>", methods=["GET"])
def get_form1b(id):
    record = BirthIntact.query.get_or_404(id)
    result = form1b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form1b/<int:id>", methods=["DELETE"])
def delete_form1b(id):
    record = BirthIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthIntact record deleted successfully."}), 200

# Routes for DeathIntact
@forms.route("/form2b", methods=["GET"])
def get_all_form2b():
    records = DeathIntact.query.all()
    result = form2b_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form2b", methods=["POST"])
def add_form2b():
    data = request.get_json()
    new_record = form2b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2b_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form2b/<int:id>", methods=["GET"])
def get_form2b(id):
    record = DeathIntact.query.get_or_404(id)
    result = form2b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2b/<int:id>", methods=["DELETE"])
def delete_form2b(id):
    record = DeathIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathIntact record deleted successfully."}), 200

# Routes for MarriageIntact
@forms.route("/form3b", methods=["GET"])
def get_all_form3b():
    records = MarriageIntact.query.all()
    result = form3b_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form3b", methods=["POST"])
def add_form3b():
    data = request.get_json()
    new_record = form3b_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3b_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form3b/<int:id>", methods=["GET"])
def get_form3b(id):
    record = MarriageIntact.query.get_or_404(id)
    result = form3b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3b/<int:id>", methods=["DELETE"])
def delete_form3b(id):
    record = MarriageIntact.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageIntact record deleted successfully."}), 200

# Routes for BirthDestroyed
@forms.route("/form1c", methods=["GET"])
def get_all_form1c():
    records = BirthDestroyed.query.all()
    result = form1c_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form1c", methods=["POST"])
def add_form1c():
    data = request.get_json()
    new_record = form1c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1c_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form1c/<int:id>", methods=["GET"])
def get_form1c(id):
    record = BirthDestroyed.query.get_or_404(id)
    result = form1c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form1c/<int:id>", methods=["DELETE"])
def delete_form1c(id):
    record = BirthDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthDestroyed record deleted successfully."}), 200

# Routes for DeathDestroyed
@forms.route("/form2c", methods=["GET"])
def get_all_form2c():
    records = DeathDestroyed.query.all()
    result = form2c_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form2c", methods=["POST"])
def add_form2c():
    data = request.get_json()
    new_record = form2c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2c_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form2c/<int:id>", methods=["GET"])
def get_form2c(id):
    record = DeathDestroyed.query.get_or_404(id)
    result = form2c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2c/<int:id>", methods=["DELETE"])
def delete_form2c(id):
    record = DeathDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathDestroyed record deleted successfully."}), 200

# Routes for MarriageDestroyed
@forms.route("/form3c", methods=["GET"])
def get_all_form3c():
    records = MarriageDestroyed.query.all()
    result = form3c_list_schema.dump(records)
    return jsonify(result), 200

@forms.route("/form3c", methods=["POST"])
def add_form3c():
    data = request.get_json()
    new_record = form3c_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3c_schema.dump(new_record)
    return jsonify(result), 201

@forms.route("/form3c/<int:id>", methods=["GET"])
def get_form3c(id):
    record = MarriageDestroyed.query.get_or_404(id)
    result = form3c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3c/<int:id>", methods=["DELETE"])
def delete_form3c(id):
    record = MarriageDestroyed.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageDestroyed record deleted successfully."}), 200