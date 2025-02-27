from ..extensions import db, jsonify, request, Blueprint
from ..models.form import Form1A, Form2A, Form3A, Form1B, Form2B, Form3B, Form1C, Form2C, Form3C
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

# Routes for Form1A
@forms.route("/form1a", methods=["GET"])
def get_all_form1a():
    records = Form1A.query.all()
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
    record = Form1A.query.get_or_404(id)
    result = form1a_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form1a/<int:id>", methods=["DELETE"])
def delete_form1a(id):
    record = Form1A.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form1A record deleted successfully."}), 200

# Repeat similar routes for Form2A, Form3A, Form1B, Form2B, Form3B, Form1C, Form2C, Form3C

# Example for Form2A
@forms.route("/form2a", methods=["GET"])
def get_all_form2a():
    records = Form2A.query.all()
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
    record = Form2A.query.get_or_404(id)
    result = form2a_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2a/<int:id>", methods=["DELETE"])
def delete_form2a(id):
    record = Form2A.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form2A record deleted successfully."}), 200

# 3A Routes

# Add the following routes for Form3A

@forms.route("/form3a", methods=["GET"])
def get_all_form3a():
    records = Form3A.query.all()
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
    record = Form3A.query.get_or_404(id)
    result = form3a_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3a/<int:id>", methods=["DELETE"])
def delete_form3a(id):
    record = Form3A.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form3A record deleted successfully."}), 200


# -------------------------- Routes --------------------------------------------------------------------------------------------


# Routes for Form1B
@forms.route("/form1b", methods=["GET"])
def get_all_form1b():
    records = Form1B.query.all()
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
    record = Form1B.query.get_or_404(id)
    result = form1b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form1b/<int:id>", methods=["DELETE"])
def delete_form1b(id):
    record = Form1B.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form1B record deleted successfully."}), 200

# Routes for Form2B
@forms.route("/form2b", methods=["GET"])
def get_all_form2b():
    records = Form2B.query.all()
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
    record = Form2B.query.get_or_404(id)
    result = form2b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2b/<int:id>", methods=["DELETE"])
def delete_form2b(id):
    record = Form2B.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form2B record deleted successfully."}), 200

# Routes for Form3B
@forms.route("/form3b", methods=["GET"])
def get_all_form3b():
    records = Form3B.query.all()
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
    record = Form3B.query.get_or_404(id)
    result = form3b_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3b/<int:id>", methods=["DELETE"])
def delete_form3b(id):
    record = Form3B.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form3B record deleted successfully."}), 200

# Routes for Form1C
@forms.route("/form1c", methods=["GET"])
def get_all_form1c():
    records = Form1C.query.all()
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
    record = Form1C.query.get_or_404(id)
    result = form1c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form1c/<int:id>", methods=["DELETE"])
def delete_form1c(id):
    record = Form1C.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form1C record deleted successfully."}), 200

# Routes for Form2C
@forms.route("/form2c", methods=["GET"])
def get_all_form2c():
    records = Form2C.query.all()
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
    record = Form2C.query.get_or_404(id)
    result = form2c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form2c/<int:id>", methods=["DELETE"])
def delete_form2c(id):
    record = Form2C.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form2C record deleted successfully."}), 200

# Routes for Form3C
@forms.route("/form3c", methods=["GET"])
def get_all_form3c():
    records = Form3C.query.all()
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
    record = Form3C.query.get_or_404(id)
    result = form3c_schema.dump(record)
    return jsonify(result), 200

@forms.route("/form3c/<int:id>", methods=["DELETE"])
def delete_form3c(id):
    record = Form3C.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Form3C record deleted successfully."}), 200