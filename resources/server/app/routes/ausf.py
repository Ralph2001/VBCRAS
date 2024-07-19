from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.ausf import Ausf
from ..schemas.ausf_schema import AusfSchema


ausf = Blueprint("ausf", __name__)

# Schema Initialize
ausf_schema = AusfSchema()
ausf_list_schema = AusfSchema(many=True)


#########
# View
#########


@ausf.route("/ausf", methods=["GET"])
def get_all_ausf():
    ausf_records = Ausf.query.all()
    result = ausf_list_schema.dump(ausf_records)
    return jsonify(result), 200


#########
# Insert
#########


@ausf.route("/ausf", methods=["POST"])
def add_ausf():
    data = request.get_json()

    new_ausf = ausf_schema.load(data, session=db.session)

    db.session.add(new_ausf)
    db.session.commit()

    result = ausf_schema.dump(new_ausf)
    return jsonify(result), 201


#########
# Edit
#########


@ausf.route("/ausf/<int:id>", methods=["GET"])
def get_ausf(id):
    ausf_record = Ausf.query.get_or_404(id)
    result = ausf_schema.dump(ausf_record)
    return jsonify(result), 200


#########
# Delete
#########
