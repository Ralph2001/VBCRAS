from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.civil_registry_corrections import Petitions
from ..schemas.petition_schema import PetitionSchema


petitions = Blueprint("petitions", __name__)

# Schema Initialize
petition_schema = PetitionSchema()
petitions_list_schema = PetitionSchema(many=True)


#########
# View
#########


@petitions.route("/petitions", methods=["GET"])
def get_all_petitions():
    petitions_records = Petitions.query.all()
    result = petitions_list_schema.dump(petitions_records)
    return jsonify(result), 200

@petitions.route("/petitions/get-petition/<int:id>", methods=["GET"])
def get_petition_by_id(id):
    petition_record = Petitions.query.get(id)
    
    if not petition_record:
        return jsonify({"message": "Petition not found"}), 404
    
    result = petition_schema.dump(petition_record)
    return jsonify(result), 200


# Get Latest Petitions
@petitions.route("/petitions/latest-cce", methods=["GET"])
def get_latest_cce_petition():
    latest_petition = Petitions.query.filter_by(petition_type="CCE").order_by(Petitions.date_filed.desc()).first()
    if latest_petition:
        result = {"petition_number": latest_petition.petition_number}
        return jsonify(result), 200
    else:
        return jsonify({"message": "No CCE petition found"}), 404

@petitions.route("/petitions/latest-cfn", methods=["GET"])
def get_latest_cfn_petition():
    latest_petition = Petitions.query.filter_by(petition_type="CFN").order_by(Petitions.date_filed.desc()).first()
    if latest_petition:
        result = {"petition_number": latest_petition.petition_number}
        return jsonify(result), 200
    else:
        return jsonify({"message": "No CFN petition found"}), 404

#########
# Insert
#########


@petitions.route("/petitions/add-petition", methods=["POST"])
def add_petition():
    data = request.get_json()
    new_petition = petition_schema.load(data, session=db.session)
    db.session.add(new_petition)
    db.session.commit()
    result = petition_schema.dump(new_petition)
    return jsonify(result), 201



