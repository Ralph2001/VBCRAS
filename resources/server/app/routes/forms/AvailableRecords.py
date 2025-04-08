from ...extensions import db, jsonify, request, Blueprint
from ...models.form import BirthAvailable, DeathAvailable, MarriageAvailable
from ...schemas.forms_schema import Form1ASchema, Form2ASchema, Form3ASchema

formAvailableRoute = Blueprint("formAvailableRoute", __name__)

form1a_schema = Form1ASchema()
form1a_list_schema = Form1ASchema(many=True)
form2a_schema = Form2ASchema()
form2a_list_schema = Form2ASchema(many=True)
form3a_schema = Form3ASchema()
form3a_list_schema = Form3ASchema(many=True)


# Routes for Birth Available, CRUD
@formAvailableRoute.route("/form1a", methods=["GET"])
def get_all_form1a():
    records = BirthAvailable.query.all()
    result = form1a_list_schema.dump(records)
    return jsonify(result), 200

@formAvailableRoute.route("/form1a", methods=["POST"])
def add_form1a():
    data = request.get_json()
    new_record = form1a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form1a_schema.dump(new_record)
    return jsonify(result), 201

@formAvailableRoute.route("/form1a/<int:id>", methods=["GET"])
def get_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    result = form1a_schema.dump(record)
    return jsonify(result), 200


@formAvailableRoute.route("/form1a/<int:id>", methods=["PUT"])
def update_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    data = request.get_json()
    updated_record = form1a_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form1a_schema.dump(updated_record)
    return jsonify(result), 200


@formAvailableRoute.route("/form1a/<int:id>", methods=["DELETE"])
def delete_form1a(id):
    record = BirthAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "BirthAvailable record deleted successfully."}), 200

# Routes for Death Available, CRUD

@formAvailableRoute.route("/form2a", methods=["GET"])
def get_all_form2a():
    records = DeathAvailable.query.all()
    result = form2a_list_schema.dump(records)
    return jsonify(result), 200

@formAvailableRoute.route("/form2a", methods=["POST"])
def add_form2a():
    data = request.get_json()
    new_record = form2a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form2a_schema.dump(new_record)
    return jsonify(result), 201

@formAvailableRoute.route("/form2a/<int:id>", methods=["GET"])
def get_form2a(id):
    record = DeathAvailable.query.get_or_404(id)
    result = form2a_schema.dump(record)
    return jsonify(result), 200

@formAvailableRoute.route("/form2a/<int:id>", methods=["PUT"])
def update_form2a(id):
    record = DeathAvailable.query.get_or_404(id)
    data = request.get_json()
    updated_record = form2a_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form2a_schema.dump(updated_record)
    return jsonify(result), 200

@formAvailableRoute.route("/form2a/<int:id>", methods=["DELETE"])
def delete_form2a(id):
    record = DeathAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "DeathAvailable record deleted successfully."}), 200

# Routes for Marriage Available, CRUD

@formAvailableRoute.route("/form3a", methods=["GET"])
def get_all_form3a():
    records = MarriageAvailable.query.all()
    result = form3a_list_schema.dump(records)
    return jsonify(result), 200

@formAvailableRoute.route("/form3a", methods=["POST"])
def add_form3a():
    data = request.get_json()
    new_record = form3a_schema.load(data, session=db.session)
    db.session.add(new_record)
    db.session.commit()
    result = form3a_schema.dump(new_record)
    return jsonify(result), 201

@formAvailableRoute.route("/form3a/<int:id>", methods=["GET"])
def get_form3a(id):
    record = MarriageAvailable.query.get_or_404(id)
    result = form3a_schema.dump(record)
    return jsonify(result), 200

@formAvailableRoute.route("/form3a/<int:id>", methods=["PUT"])
def update_form3a(id):
    record = MarriageAvailable.query.get_or_404(id)
    data = request.get_json()
    updated_record = form3a_schema.load(data, instance=record, session=db.session)
    db.session.commit()
    result = form3a_schema.dump(updated_record)
    return jsonify(result), 200

@formAvailableRoute.route("/form3a/<int:id>", methods=["DELETE"])
def delete_form3a(id):
    record = MarriageAvailable.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "MarriageAvailable record deleted successfully."}), 200