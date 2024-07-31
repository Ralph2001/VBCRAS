from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.scanned import Scans
from ..schemas.scanned_schema import ScannnedSchema


scans = Blueprint("scans", __name__)

# Schema Initialize
scan_schema = ScannnedSchema()
scans_list_schema = ScannnedSchema(many=True)


#########
# View
#########

@scans.route("/scanned", methods=["GET"])
def get_all_scanned():
    scanned_records = Scans.query.all()
    result = scans_list_schema.dump(scanned_records)
    return jsonify(result), 200


@scans.route("/scanned", methods=["POST"])
def add_scanned_document():
    data = request.get_json()
    # Validate and deserialize input
    add_scanned_documents = scans_list_schema.load(data, session=db.session)

    # Add each document to the database
    for scanned_document in add_scanned_documents:
        db.session.add(scanned_document)
    
    db.session.commit()

    result = scans_list_schema.dump(add_scanned_documents)
    return jsonify(result), 201


#########
# Insert
#########


# @scans.route("/ausf", methods=["POST"])
# def add_ausf():
#     data = request.get_json()
#     new_ausf = ausf_schema.load(data, session=db.session)

#     db.session.add(new_ausf)
#     db.session.commit()

#     result = ausf_schema.dump(new_ausf)
#     return jsonify(result), 201


#########
# Edit
#########


# @scans.route("/ausf/<int:id>", methods=["GET"])
# def get_ausf(id):
#     ausf_record = Ausf.query.get_or_404(id)
#     result = ausf_schema.dump(ausf_record)
#     return jsonify(result), 200


#########
# Delete
#########


# @scans.route("/ausf/<int:id>", methods=["DELETE"])
# def delete_ausf(id):
#     ausf_record = Ausf.query.get_or_404(id)
#     db.session.delete(ausf_record)
#     db.session.commit()
#     return jsonify({"message": "Ausf record deleted successfully."}), 200
